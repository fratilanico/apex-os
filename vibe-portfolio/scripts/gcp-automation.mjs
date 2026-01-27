#!/usr/bin/env node
/**
 * GCP Vertex AI Setup Automation
 * Controls Chrome to enable Vertex AI and create service account
 */

import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';

const CDP_BASE = 'http://127.0.0.1:9222';
const SCREENSHOT_DIR = '/Users/nico/vibe-portfolio/gcp-screenshots';
const PROJECT_ID = 'newsletter-source-hub';

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function getPages() {
  const res = await fetch(`${CDP_BASE}/json/list`);
  const pages = await res.json();
  return pages.filter(p => p.type === 'page');
}

async function connectToPage(pageId) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${pageId}`);
    ws.on('open', () => resolve(ws));
    ws.on('error', reject);
  });
}

async function sendCommand(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Date.now();
    const timeout = setTimeout(() => reject(new Error(`Timeout: ${method}`)), 30000);
    
    const handler = (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === id) {
        clearTimeout(timeout);
        ws.off('message', handler);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };
    
    ws.on('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function screenshot(ws, name) {
  const result = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  const filepath = path.join(SCREENSHOT_DIR, `${name}.png`);
  fs.writeFileSync(filepath, Buffer.from(result.data, 'base64'));
  console.log(`  Screenshot: ${filepath}`);
  return filepath;
}

async function navigate(ws, url) {
  console.log(`  Navigating to: ${url}`);
  await sendCommand(ws, 'Page.navigate', { url });
  await sleep(3000);
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getPageContent(ws) {
  const result = await sendCommand(ws, 'Runtime.evaluate', {
    expression: 'document.body.innerText',
    returnByValue: true
  });
  return result.result.value || '';
}

async function getPageUrl(ws) {
  const result = await sendCommand(ws, 'Runtime.evaluate', {
    expression: 'window.location.href',
    returnByValue: true
  });
  return result.result.value || '';
}

async function click(ws, selector) {
  console.log(`  Clicking: ${selector}`);
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `document.querySelector('${selector}')?.click()`,
  });
  await sleep(2000);
}

async function type(ws, selector, text) {
  console.log(`  Typing into: ${selector}`);
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      const el = document.querySelector('${selector}');
      if (el) {
        el.focus();
        el.value = '${text}';
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    `,
  });
  await sleep(500);
}

async function main() {
  console.log('=== GCP Vertex AI Setup Automation ===\n');
  
  // Get pages
  const pages = await getPages();
  console.log(`Found ${pages.length} Chrome tabs`);
  
  if (pages.length === 0) {
    console.error('No Chrome tabs found! Launch Chrome first.');
    process.exit(1);
  }
  
  // Find or use the main page
  let targetPage = pages.find(p => p.url.includes('console.cloud.google.com')) || pages[0];
  console.log(`Using tab: ${targetPage.title || 'Untitled'} - ${targetPage.url}\n`);
  
  // Connect
  const ws = await connectToPage(targetPage.id);
  console.log('Connected to Chrome DevTools\n');
  
  // Enable Page domain
  await sendCommand(ws, 'Page.enable');
  
  // Step 1: Check current state
  console.log('STEP 1: Checking current page state...');
  const currentUrl = await getPageUrl(ws);
  await screenshot(ws, '01-initial-state');
  console.log(`  Current URL: ${currentUrl}\n`);
  
  // Step 2: Navigate to Vertex AI API page
  console.log('STEP 2: Navigating to Vertex AI API enablement page...');
  await navigate(ws, `https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=${PROJECT_ID}`);
  await sleep(3000);
  await screenshot(ws, '02-vertex-ai-api-page');
  
  // Check page content for login requirement
  const content = await getPageContent(ws);
  const url = await getPageUrl(ws);
  
  if (url.includes('accounts.google.com') || content.includes('Sign in')) {
    console.log('\n!!! LOGIN REQUIRED !!!');
    console.log('Please sign in to Google in the Chrome window.');
    console.log('The browser should be visible on your screen now.');
    await screenshot(ws, '02b-login-required');
    
    // Wait for login - poll every 5 seconds
    console.log('\nWaiting for login (checking every 5 seconds)...');
    let loggedIn = false;
    for (let i = 0; i < 60; i++) { // Wait up to 5 minutes
      await sleep(5000);
      const checkUrl = await getPageUrl(ws);
      if (checkUrl.includes('console.cloud.google.com') && !checkUrl.includes('accounts.google.com')) {
        loggedIn = true;
        console.log('  Login detected!');
        break;
      }
      console.log(`  Still waiting... (${i * 5}s)`);
    }
    
    if (!loggedIn) {
      console.log('Login timeout. Please login manually and re-run.');
      process.exit(1);
    }
    
    // Re-navigate after login
    await navigate(ws, `https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=${PROJECT_ID}`);
    await sleep(3000);
  }
  
  await screenshot(ws, '03-after-login');
  console.log('  Page loaded\n');
  
  // Step 3: Check if API is already enabled
  console.log('STEP 3: Checking Vertex AI API status...');
  const pageText = await getPageContent(ws);
  
  if (pageText.includes('API enabled') || pageText.includes('MANAGE') || pageText.includes('Manage')) {
    console.log('  Vertex AI API is ALREADY ENABLED!\n');
  } else if (pageText.includes('ENABLE') || pageText.includes('Enable')) {
    console.log('  Clicking ENABLE button...');
    await sendCommand(ws, 'Runtime.evaluate', {
      expression: `
        const btns = Array.from(document.querySelectorAll('button'));
        const enableBtn = btns.find(b => b.textContent.includes('Enable') || b.textContent.includes('ENABLE'));
        if (enableBtn) enableBtn.click();
      `
    });
    await sleep(5000);
    await screenshot(ws, '04-enabling-api');
    console.log('  API enabling...\n');
  }
  
  // Step 4: Navigate to Service Accounts
  console.log('STEP 4: Navigating to Service Accounts...');
  await navigate(ws, `https://console.cloud.google.com/iam-admin/serviceaccounts?project=${PROJECT_ID}`);
  await sleep(4000);
  await screenshot(ws, '05-service-accounts');
  
  // Step 5: Create new service account
  console.log('STEP 5: Creating new Service Account...');
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      const btns = Array.from(document.querySelectorAll('button, a'));
      const createBtn = btns.find(b => 
        b.textContent.includes('Create service account') || 
        b.textContent.includes('CREATE SERVICE ACCOUNT') ||
        b.getAttribute('aria-label')?.includes('Create')
      );
      if (createBtn) createBtn.click();
    `
  });
  await sleep(3000);
  await screenshot(ws, '06-create-sa-dialog');
  
  // Fill service account details
  console.log('  Filling service account details...');
  const saName = 'vibe-academy-vertex';
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      // Find and fill the name input
      const inputs = Array.from(document.querySelectorAll('input'));
      const nameInput = inputs.find(i => 
        i.placeholder?.includes('name') || 
        i.getAttribute('aria-label')?.includes('name') ||
        i.id?.includes('name')
      );
      if (nameInput) {
        nameInput.focus();
        nameInput.value = '${saName}';
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    `
  });
  await sleep(1000);
  
  // Click Create/Continue
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      const btns = Array.from(document.querySelectorAll('button'));
      const createBtn = btns.find(b => 
        b.textContent.includes('Create') || 
        b.textContent.includes('CREATE') ||
        b.textContent.includes('Done') ||
        b.textContent.includes('DONE')
      );
      if (createBtn) createBtn.click();
    `
  });
  await sleep(3000);
  await screenshot(ws, '07-sa-created');
  
  console.log('\n=== AUTOMATION PROGRESS ===');
  console.log('Screenshots saved to:', SCREENSHOT_DIR);
  console.log('\nNext steps may require manual interaction.');
  console.log('Check the Chrome window for current state.');
  
  ws.close();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
