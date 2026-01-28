#!/usr/bin/env node
/**
 * GCP Vertex AI Setup with Puppeteer
 */

import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const PROJECT_ID = 'newsletter-source-hub';
const SCREENSHOT_DIR = '/Users/nico/vibe-portfolio/gcp-screenshots';
const SA_NAME = 'vibe-academy-vertex';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function screenshot(page, name) {
  const filepath = path.join(SCREENSHOT_DIR, `${name}.png`);
  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`  Screenshot: ${name}.png`);
  return filepath;
}

async function waitAndClick(page, selector, options = {}) {
  try {
    await page.waitForSelector(selector, { timeout: 10000, ...options });
    await page.click(selector);
    return true;
  } catch (e) {
    console.log(`  Could not find/click: ${selector}`);
    return false;
  }
}

async function main() {
  console.log('=== GCP Vertex AI Setup (Puppeteer) ===\n');
  
  // Connect to existing Chrome - get WebSocket URL first
  console.log('Connecting to Chrome on port 9222...');
  const versionRes = await fetch('http://127.0.0.1:9222/json/version');
  const versionInfo = await versionRes.json();
  const wsUrl = versionInfo.webSocketDebuggerUrl.replace('localhost', '127.0.0.1');
  console.log(`  WebSocket URL: ${wsUrl}`);
  
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsUrl,
    defaultViewport: null
  });
  
  const pages = await browser.pages();
  console.log(`Found ${pages.length} tabs\n`);
  
  let page = pages[0];
  
  // Step 1: Check current URL
  const currentUrl = page.url();
  console.log('STEP 1: Current state');
  console.log(`  URL: ${currentUrl}`);
  await screenshot(page, '01-initial');
  
  // Step 2: Navigate to Vertex AI API page
  console.log('\nSTEP 2: Navigate to Vertex AI API page');
  await page.goto(`https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=${PROJECT_ID}`, {
    waitUntil: 'networkidle2',
    timeout: 60000
  });
  await screenshot(page, '02-vertex-api-page');
  
  // Check if logged in
  const url = page.url();
  if (url.includes('accounts.google.com')) {
    console.log('\n!!! LOGIN REQUIRED !!!');
    console.log('Please sign in to Google in the Chrome window.');
    console.log('Waiting for login...\n');
    await screenshot(page, '02b-login-page');
    
    // Wait for navigation away from login
    await page.waitForFunction(
      () => !window.location.href.includes('accounts.google.com'),
      { timeout: 300000 } // 5 min timeout
    );
    console.log('Login detected! Continuing...\n');
    
    // Re-navigate
    await page.goto(`https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=${PROJECT_ID}`, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
  }
  
  await screenshot(page, '03-api-page-loaded');
  
  // Step 3: Enable API if needed
  console.log('\nSTEP 3: Check/Enable Vertex AI API');
  const pageContent = await page.content();
  
  if (pageContent.includes('API enabled') || pageContent.includes('Manage')) {
    console.log('  API is ALREADY ENABLED!');
  } else {
    console.log('  Looking for Enable button...');
    const enableClicked = await waitAndClick(page, 'button[data-testid="enable-api-button"]');
    if (!enableClicked) {
      // Try other selectors
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const enableBtn = buttons.find(b => b.textContent.toLowerCase().includes('enable'));
        if (enableBtn) enableBtn.click();
      });
    }
    await page.waitForTimeout(5000);
    await screenshot(page, '04-api-enabling');
    console.log('  API enable requested');
  }
  
  // Step 4: Go to Service Accounts
  console.log('\nSTEP 4: Navigate to Service Accounts');
  await page.goto(`https://console.cloud.google.com/iam-admin/serviceaccounts?project=${PROJECT_ID}`, {
    waitUntil: 'networkidle2',
    timeout: 60000
  });
  await page.waitForTimeout(3000);
  await screenshot(page, '05-service-accounts');
  
  // Step 5: Check if service account exists
  console.log('\nSTEP 5: Check/Create Service Account');
  const saPageContent = await page.content();
  
  if (saPageContent.includes(SA_NAME)) {
    console.log(`  Service account "${SA_NAME}" already exists!`);
  } else {
    console.log('  Creating new service account...');
    
    // Click Create Service Account
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const createBtn = buttons.find(b => 
        b.textContent.toLowerCase().includes('create service account')
      );
      if (createBtn) createBtn.click();
    });
    await page.waitForTimeout(3000);
    await screenshot(page, '06-create-sa-form');
    
    // Fill form
    const nameInput = await page.$('input[formcontrolname="name"], input[name="name"], input#name');
    if (nameInput) {
      await nameInput.type(SA_NAME);
      console.log(`  Entered name: ${SA_NAME}`);
    }
    
    await page.waitForTimeout(1000);
    await screenshot(page, '07-sa-form-filled');
    
    // Click Create and Continue
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const createBtn = buttons.find(b => 
        b.textContent.toLowerCase().includes('create') ||
        b.textContent.toLowerCase().includes('continue')
      );
      if (createBtn) createBtn.click();
    });
    await page.waitForTimeout(3000);
  }
  
  // Step 6: Add Vertex AI role
  console.log('\nSTEP 6: Grant Vertex AI User role');
  await screenshot(page, '08-role-page');
  
  // Look for role dropdown
  await page.evaluate(() => {
    const roleDropdown = document.querySelector('[aria-label*="role"], [data-testid*="role"]');
    if (roleDropdown) roleDropdown.click();
  });
  await page.waitForTimeout(2000);
  
  // Type to search for role
  await page.keyboard.type('Vertex AI User');
  await page.waitForTimeout(2000);
  await screenshot(page, '09-role-search');
  
  // Click the role option
  await page.evaluate(() => {
    const options = Array.from(document.querySelectorAll('[role="option"], li, div'));
    const vertexOption = options.find(o => o.textContent.includes('Vertex AI User'));
    if (vertexOption) vertexOption.click();
  });
  await page.waitForTimeout(2000);
  
  // Click Continue/Done
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const doneBtn = buttons.find(b => 
      b.textContent.toLowerCase().includes('continue') ||
      b.textContent.toLowerCase().includes('done')
    );
    if (doneBtn) doneBtn.click();
  });
  await page.waitForTimeout(3000);
  await screenshot(page, '10-role-assigned');
  
  // Step 7: Create key
  console.log('\nSTEP 7: Create JSON key');
  
  // Navigate to the service account
  await page.goto(`https://console.cloud.google.com/iam-admin/serviceaccounts/details/${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com/keys?project=${PROJECT_ID}`, {
    waitUntil: 'networkidle2',
    timeout: 60000
  });
  await page.waitForTimeout(3000);
  await screenshot(page, '11-keys-page');
  
  // Click Add Key > Create new key
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const addKeyBtn = buttons.find(b => b.textContent.toLowerCase().includes('add key'));
    if (addKeyBtn) addKeyBtn.click();
  });
  await page.waitForTimeout(2000);
  
  // Click Create new key
  await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('[role="menuitem"], button, a'));
    const createKeyItem = items.find(i => i.textContent.toLowerCase().includes('create new key'));
    if (createKeyItem) createKeyItem.click();
  });
  await page.waitForTimeout(2000);
  await screenshot(page, '12-create-key-dialog');
  
  // Select JSON and create
  await page.evaluate(() => {
    // Select JSON radio if not already selected
    const jsonRadio = document.querySelector('input[value="JSON"], input[type="radio"]');
    if (jsonRadio) jsonRadio.click();
    
    // Click Create
    const buttons = Array.from(document.querySelectorAll('button'));
    const createBtn = buttons.find(b => b.textContent.toLowerCase() === 'create');
    if (createBtn) createBtn.click();
  });
  await page.waitForTimeout(5000);
  await screenshot(page, '13-key-created');
  
  console.log('\n=== SETUP COMPLETE ===');
  console.log('Screenshots saved to:', SCREENSHOT_DIR);
  console.log('\nThe JSON key should have been downloaded to your Downloads folder.');
  console.log('Move it to your project and set GOOGLE_APPLICATION_CREDENTIALS.\n');
  
  // Don't disconnect - keep browser open
  console.log('Browser left open for verification.');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
