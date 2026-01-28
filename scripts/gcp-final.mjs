#!/usr/bin/env node
/**
 * GCP Vertex AI Setup - Final Version
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
  await page.screenshot({ path: filepath, fullPage: false });
  console.log(`  [Screenshot] ${name}.png`);
  return filepath;
}

async function main() {
  console.log('=== GCP Vertex AI Setup ===\n');
  
  // Get WebSocket URL
  const versionRes = await fetch('http://127.0.0.1:9222/json/version');
  const versionInfo = await versionRes.json();
  const wsUrl = versionInfo.webSocketDebuggerUrl.replace('localhost', '127.0.0.1');
  
  console.log('Connecting to Chrome...');
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsUrl,
    defaultViewport: { width: 1400, height: 900 }
  });
  
  const pages = await browser.pages();
  let page = pages.find(p => p.url() !== 'about:blank') || pages[0];
  
  // Create new page for cleaner session
  page = await browser.newPage();
  console.log('Connected!\n');

  try {
    // STEP 1: Navigate to GCP Console
    console.log('STEP 1: Going to Google Cloud Console...');
    await page.goto('https://console.cloud.google.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    await new Promise(r => setTimeout(r, 5000));
    await screenshot(page, '01-gcp-console');
    
    let currentUrl = page.url();
    console.log(`  Current URL: ${currentUrl}`);
    
    // Check for login
    if (currentUrl.includes('accounts.google.com')) {
      console.log('\n========================================');
      console.log('  LOGIN REQUIRED!');
      console.log('  Please sign in in the Chrome window.');
      console.log('  Waiting for you to complete login...');
      console.log('========================================\n');
      
      await screenshot(page, '01b-login-required');
      
      // Poll for login completion
      let attempts = 0;
      while (attempts < 120) { // 10 minutes max
        await new Promise(r => setTimeout(r, 5000));
        currentUrl = page.url();
        if (!currentUrl.includes('accounts.google.com') && currentUrl.includes('console.cloud.google.com')) {
          console.log('  Login successful!\n');
          break;
        }
        attempts++;
        if (attempts % 6 === 0) console.log(`  Still waiting for login... (${attempts * 5}s)`);
      }
    }
    
    await screenshot(page, '02-logged-in');
    
    // STEP 2: Enable Vertex AI API
    console.log('STEP 2: Enabling Vertex AI API...');
    await page.goto(`https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=${PROJECT_ID}`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    await new Promise(r => setTimeout(r, 5000));
    await screenshot(page, '03-vertex-api-page');
    
    // Check if already enabled
    const content = await page.content();
    if (content.includes('API enabled') || content.includes('Manage') || content.includes('MANAGE')) {
      console.log('  Vertex AI API already enabled!');
    } else {
      console.log('  Looking for Enable button...');
      try {
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
          const enableBtn = buttons.find(b => {
            const text = b.textContent?.toLowerCase() || '';
            return text.includes('enable') && !text.includes('enabled');
          });
          if (enableBtn) {
            console.log('Found enable button, clicking...');
            enableBtn.click();
          }
        });
        await new Promise(r => setTimeout(r, 8000));
        await screenshot(page, '03b-api-enabled');
        console.log('  API Enable clicked!');
      } catch (e) {
        console.log('  Enable button not found or API already enabled');
      }
    }
    
    // STEP 3: Go to Service Accounts
    console.log('\nSTEP 3: Going to Service Accounts...');
    await page.goto(`https://console.cloud.google.com/iam-admin/serviceaccounts?project=${PROJECT_ID}`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    await new Promise(r => setTimeout(r, 5000));
    await screenshot(page, '04-service-accounts');
    
    // Check if SA exists
    const saContent = await page.content();
    if (saContent.includes(SA_NAME) || saContent.includes('vibe-academy')) {
      console.log(`  Service account "${SA_NAME}" may already exist`);
      console.log('  Proceeding to key creation...');
    } else {
      // Create service account
      console.log('  Creating service account...');
      await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a, button'));
        const createBtn = links.find(l => l.textContent?.toLowerCase().includes('create service account'));
        if (createBtn) createBtn.click();
      });
      await new Promise(r => setTimeout(r, 3000));
      await screenshot(page, '05-create-sa-dialog');
      
      // Type name
      await page.evaluate((name) => {
        const inputs = Array.from(document.querySelectorAll('input'));
        const nameInput = inputs.find(i => {
          const label = i.getAttribute('aria-label') || '';
          const placeholder = i.placeholder || '';
          return label.toLowerCase().includes('name') || placeholder.toLowerCase().includes('name');
        });
        if (nameInput) {
          nameInput.focus();
          nameInput.value = name;
          nameInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, SA_NAME);
      await new Promise(r => setTimeout(r, 1000));
      
      // Click Create
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const createBtn = buttons.find(b => {
          const text = b.textContent?.toLowerCase() || '';
          return text === 'create' || text === 'create and continue';
        });
        if (createBtn) createBtn.click();
      });
      await new Promise(r => setTimeout(r, 3000));
      await screenshot(page, '06-sa-role-page');
      
      // Add Vertex AI User role
      console.log('  Adding Vertex AI User role...');
      await page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('[role="listbox"], [role="combobox"], select, .role-select'));
        if (selects.length > 0) selects[0].click();
      });
      await new Promise(r => setTimeout(r, 2000));
      
      // Search for role
      await page.keyboard.type('Vertex AI User');
      await new Promise(r => setTimeout(r, 2000));
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 2000));
      
      // Continue
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const continueBtn = buttons.find(b => {
          const text = b.textContent?.toLowerCase() || '';
          return text.includes('continue') || text.includes('done');
        });
        if (continueBtn) continueBtn.click();
      });
      await new Promise(r => setTimeout(r, 3000));
      
      // Done
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const doneBtn = buttons.find(b => b.textContent?.toLowerCase().includes('done'));
        if (doneBtn) doneBtn.click();
      });
      await new Promise(r => setTimeout(r, 3000));
      await screenshot(page, '07-sa-created');
    }
    
    // STEP 4: Create JSON Key
    console.log('\nSTEP 4: Creating JSON key...');
    
    // Navigate to keys page
    await page.goto(`https://console.cloud.google.com/iam-admin/serviceaccounts?project=${PROJECT_ID}`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    await new Promise(r => setTimeout(r, 5000));
    
    // Click on the service account row
    await page.evaluate((name) => {
      const rows = Array.from(document.querySelectorAll('tr, [role="row"]'));
      const targetRow = rows.find(r => r.textContent?.includes(name) || r.textContent?.includes('vibe'));
      if (targetRow) {
        const link = targetRow.querySelector('a');
        if (link) link.click();
      }
    }, SA_NAME);
    await new Promise(r => setTimeout(r, 3000));
    
    // Go to Keys tab
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('[role="tab"], a'));
      const keysTab = tabs.find(t => t.textContent?.toLowerCase().includes('keys'));
      if (keysTab) keysTab.click();
    });
    await new Promise(r => setTimeout(r, 3000));
    await screenshot(page, '08-keys-tab');
    
    // Add Key
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const addKeyBtn = buttons.find(b => b.textContent?.toLowerCase().includes('add key'));
      if (addKeyBtn) addKeyBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    
    // Create new key
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('[role="menuitem"], li, a'));
      const createItem = items.find(i => i.textContent?.toLowerCase().includes('create new key'));
      if (createItem) createItem.click();
    });
    await new Promise(r => setTimeout(r, 2000));
    await screenshot(page, '09-create-key-dialog');
    
    // Select JSON and Create
    await page.evaluate(() => {
      // Make sure JSON is selected
      const radios = Array.from(document.querySelectorAll('input[type="radio"]'));
      const jsonRadio = radios.find(r => {
        const label = r.closest('label')?.textContent || '';
        return label.includes('JSON');
      });
      if (jsonRadio) jsonRadio.click();
      
      // Click Create
      setTimeout(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const createBtn = buttons.find(b => {
          const text = b.textContent?.trim().toLowerCase();
          return text === 'create';
        });
        if (createBtn) createBtn.click();
      }, 1000);
    });
    await new Promise(r => setTimeout(r, 5000));
    await screenshot(page, '10-key-created');
    
    console.log('\n========================================');
    console.log('  SETUP COMPLETE!');
    console.log('========================================');
    console.log('\nThe JSON key should have downloaded to ~/Downloads/');
    console.log('\nScreenshots saved to:', SCREENSHOT_DIR);
    
    // Final screenshot
    await screenshot(page, '11-final-state');
    
  } catch (error) {
    console.error('\nError occurred:', error.message);
    await screenshot(page, 'error-state');
    throw error;
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
