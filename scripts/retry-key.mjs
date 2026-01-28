#!/usr/bin/env node
import puppeteer from 'puppeteer-core';
import fs from 'fs';

const SCREENSHOTS = '/Users/nico/vibe-portfolio/gcp-screenshots';
const PROJECT_ID = 'newsletter-source-hub';

async function snap(page, name) {
  await page.screenshot({ path: `${SCREENSHOTS}/${name}.png` });
  console.log(`[SNAP] ${name}`);
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('Connecting to Chrome...');
  
  const versionRes = await fetch('http://127.0.0.1:9222/json/version');
  const versionInfo = await versionRes.json();
  const wsUrl = versionInfo.webSocketDebuggerUrl.replace('localhost', '127.0.0.1');
  
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsUrl,
    defaultViewport: null
  });
  
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('console.cloud.google.com'));
  
  if (!page) {
    console.log('ERROR: No GCP page found');
    return;
  }
  
  console.log('Found page:', page.url());
  
  // Close any dialogs
  console.log('Closing any open dialogs...');
  await page.evaluate(() => {
    const closeButtons = [...document.querySelectorAll('button')];
    const closeBtn = closeButtons.find(b => /close|cancel/i.test(b.textContent));
    if (closeBtn) closeBtn.click();
  });
  await sleep(2000);
  await snap(page, 'retry-00-start');
  
  // Refresh the page
  console.log('Refreshing page...');
  await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(3000);
  await snap(page, 'retry-01-refreshed');
  
  // Click Add Key
  console.log('Clicking Add Key...');
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const addKeyBtn = btns.find(b => /add key/i.test(b.textContent));
    if (addKeyBtn) addKeyBtn.click();
  });
  await sleep(2000);
  
  // Click Create new key
  console.log('Clicking Create new key...');
  await page.evaluate(() => {
    const items = [...document.querySelectorAll('[role="menuitem"], span, div')];
    const createItem = items.find(i => i.textContent === 'Create new key');
    if (createItem) createItem.click();
  });
  await sleep(2000);
  await snap(page, 'retry-02-dialog');
  
  // Ensure JSON is selected
  console.log('Selecting JSON...');
  await page.evaluate(() => {
    const radios = [...document.querySelectorAll('mat-radio-button, [role="radio"]')];
    const jsonRadio = radios.find(r => r.textContent && r.textContent.includes('JSON'));
    if (jsonRadio) jsonRadio.click();
  });
  await sleep(500);
  
  // Click Create
  console.log('Clicking Create...');
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const createBtn = btns.find(b => b.textContent?.trim() === 'Create');
    if (createBtn) {
      console.log('Found Create button');
      createBtn.click();
    }
  });
  
  // Wait for download
  console.log('Waiting for download...');
  await sleep(10000);
  await snap(page, 'retry-03-after-create');
  
  // Check for success or error
  const pageContent = await page.content();
  if (pageContent.includes('Unknown error') || pageContent.includes('error')) {
    console.log('\n!! KEY CREATION FAILED !!');
    console.log('This might be due to organization policy restrictions.');
    console.log('Let me check if we can use a different approach...\n');
    
    // Try gcloud CLI approach instead
    console.log('ALTERNATIVE: Use gcloud CLI');
    console.log('You need to:');
    console.log('1. Install gcloud: brew install google-cloud-sdk');
    console.log('2. Login: gcloud auth login');
    console.log('3. Create key: gcloud iam service-accounts keys create ~/vibe-portfolio/service-account.json \\');
    console.log('     --iam-account=vibe-academy-vertex@newsletter-source-hub.iam.gserviceaccount.com');
  } else {
    // Check downloads
    const downloadDir = '/Users/nico/Downloads';
    const files = fs.readdirSync(downloadDir);
    const keyFiles = files.filter(f => f.includes(PROJECT_ID) && f.endsWith('.json'));
    
    if (keyFiles.length > 0) {
      const newest = keyFiles.sort((a, b) => {
        return fs.statSync(`${downloadDir}/${b}`).mtimeMs - fs.statSync(`${downloadDir}/${a}`).mtimeMs;
      })[0];
      
      console.log('✓ KEY FILE FOUND:', newest);
      const srcPath = `${downloadDir}/${newest}`;
      const destPath = '/Users/nico/vibe-portfolio/service-account.json';
      fs.copyFileSync(srcPath, destPath);
      console.log('✓ Copied to:', destPath);
    }
  }
  
  await snap(page, 'retry-04-final');
}

main().catch(e => console.error('ERROR:', e));
