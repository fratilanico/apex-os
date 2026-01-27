#!/usr/bin/env node
import puppeteer from 'puppeteer-core';
import fs from 'fs';

const PROJECT_ID = 'newsletter-source-hub';
const SA_NAME = 'vibe-academy-vertex';
const SCREENSHOTS = '/Users/nico/vibe-portfolio/gcp-screenshots';

async function snap(page, name) {
  await page.screenshot({ path: `${SCREENSHOTS}/${name}.png` });
  console.log(`  [SNAP] ${name}`);
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('\n====== QUICK KEY CREATION ======\n');
  
  const versionRes = await fetch('http://127.0.0.1:9222/json/version');
  const versionInfo = await versionRes.json();
  const wsUrl = versionInfo.webSocketDebuggerUrl.replace('localhost', '127.0.0.1');
  
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsUrl,
    defaultViewport: null
  });
  
  const pages = await browser.pages();
  // Find the service accounts page
  let page = pages.find(p => p.url().includes('serviceaccounts'));
  
  if (!page) {
    console.log('No SA page found, using first GCP page');
    page = pages.find(p => p.url().includes('console.cloud.google.com'));
  }
  
  if (!page) {
    console.log('ERROR: No GCP page found');
    return;
  }
  
  console.log('Using page:', page.url());
  await snap(page, 'qk-00-start');
  
  // Check if we need to navigate
  if (!page.url().includes('serviceaccounts')) {
    console.log('Navigating to Service Accounts...');
    await page.goto(`https://console.cloud.google.com/iam-admin/serviceaccounts?project=${PROJECT_ID}`, {
      waitUntil: 'domcontentloaded'
    });
    await sleep(5000);
  }
  
  await snap(page, 'qk-01-sa-list');
  
  // Click on our service account row
  console.log('Looking for service account:', SA_NAME);
  await page.evaluate((name) => {
    // Find all clickable elements that contain our SA name
    const allElements = [...document.querySelectorAll('*')];
    const matches = allElements.filter(el => {
      return el.textContent && el.textContent.includes(name) && 
             (el.tagName === 'A' || el.onclick || el.getAttribute('role') === 'link');
    });
    console.log('Found matches:', matches.length);
    if (matches[0]) matches[0].click();
  }, SA_NAME);
  await sleep(3000);
  await snap(page, 'qk-02-clicked');
  
  // Now we should be on SA detail page, click KEYS tab
  console.log('Clicking KEYS tab...');
  await page.evaluate(() => {
    const tabs = [...document.querySelectorAll('a, button, [role="tab"]')];
    for (const tab of tabs) {
      if (tab.textContent && /^keys$/i.test(tab.textContent.trim())) {
        tab.click();
        return;
      }
    }
  });
  await sleep(2000);
  await snap(page, 'qk-03-keys-tab');
  
  // Click ADD KEY
  console.log('Clicking ADD KEY...');
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const addKeyBtn = btns.find(b => b.textContent && /add key/i.test(b.textContent));
    if (addKeyBtn) addKeyBtn.click();
  });
  await sleep(1500);
  await snap(page, 'qk-04-add-key');
  
  // Click Create new key
  console.log('Clicking Create new key...');
  await page.evaluate(() => {
    const items = [...document.querySelectorAll('*')];
    const createItem = items.find(i => i.textContent && /create new key/i.test(i.textContent.trim()) && i.click);
    if (createItem) createItem.click();
  });
  await sleep(2000);
  await snap(page, 'qk-05-dialog');
  
  // Select JSON and Create
  console.log('Selecting JSON and clicking CREATE...');
  await page.evaluate(() => {
    // Find and click JSON option
    const radios = [...document.querySelectorAll('[role="radio"], input[type="radio"], mat-radio-button')];
    for (const radio of radios) {
      if (radio.textContent && radio.textContent.includes('JSON')) {
        radio.click();
        break;
      }
    }
  });
  await sleep(500);
  
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const createBtn = btns.find(b => b.textContent && b.textContent.trim().toUpperCase() === 'CREATE');
    if (createBtn) createBtn.click();
  });
  await sleep(5000);
  await snap(page, 'qk-06-created');
  
  // Close any confirmation dialog
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const closeBtn = btns.find(b => b.textContent && /close|got it|ok/i.test(b.textContent.trim()));
    if (closeBtn) closeBtn.click();
  });
  await sleep(1000);
  
  // Check downloads
  console.log('\nChecking Downloads folder...');
  const downloadDir = '/Users/nico/Downloads';
  const files = fs.readdirSync(downloadDir);
  const keyFiles = files.filter(f => f.includes(PROJECT_ID) && f.endsWith('.json'));
  
  if (keyFiles.length > 0) {
    const newest = keyFiles.sort((a, b) => {
      return fs.statSync(`${downloadDir}/${b}`).mtimeMs - fs.statSync(`${downloadDir}/${a}`).mtimeMs;
    })[0];
    
    console.log('✓ Found key:', newest);
    
    const srcPath = `${downloadDir}/${newest}`;
    const destPath = '/Users/nico/vibe-portfolio/service-account.json';
    fs.copyFileSync(srcPath, destPath);
    console.log('✓ Copied to project:', destPath);
    
    const key = JSON.parse(fs.readFileSync(destPath, 'utf8'));
    console.log('✓ Service Account:', key.client_email);
  } else {
    console.log('! No key file found yet');
    console.log('  Recent JSON files:', files.filter(f => f.endsWith('.json')).slice(-5));
  }
  
  console.log('\nDONE!');
}

main().catch(e => console.error('ERROR:', e));
