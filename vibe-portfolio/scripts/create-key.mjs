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
  console.log('\n====== CREATE SERVICE ACCOUNT KEY ======\n');
  
  // Get fresh WebSocket URL
  const versionRes = await fetch('http://127.0.0.1:9222/json/version');
  const versionInfo = await versionRes.json();
  const wsUrl = versionInfo.webSocketDebuggerUrl.replace('localhost', '127.0.0.1');
  
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsUrl,
    defaultViewport: null
  });
  
  const pages = await browser.pages();
  let page = pages.find(p => p.url().includes('console.cloud.google.com') && !p.url().includes('RotateCookies'));
  
  if (!page) {
    page = await browser.newPage();
  }
  
  console.log('[1] Going to Service Accounts...');
  await page.goto(`https://console.cloud.google.com/iam-admin/serviceaccounts?project=${PROJECT_ID}`, {
    waitUntil: 'networkidle2',
    timeout: 60000
  });
  await sleep(4000);
  await snap(page, 'key-01-sa-list');
  
  // Find and click on our service account
  console.log('[2] Clicking on service account...');
  const clicked = await page.evaluate((name) => {
    const rows = [...document.querySelectorAll('tr, [role="row"], a')];
    for (const row of rows) {
      if (row.textContent && row.textContent.includes(name)) {
        const link = row.querySelector('a') || row;
        if (link.click) {
          link.click();
          return true;
        }
      }
    }
    // Try direct link approach
    const links = [...document.querySelectorAll('a')];
    const saLink = links.find(l => l.href && l.href.includes(name));
    if (saLink) {
      saLink.click();
      return true;
    }
    return false;
  }, SA_NAME);
  
  console.log('  Click result:', clicked);
  await sleep(4000);
  await snap(page, 'key-02-sa-detail');
  
  // Click on KEYS tab
  console.log('[3] Clicking KEYS tab...');
  await page.evaluate(() => {
    const tabs = [...document.querySelectorAll('[role="tab"], a, button')];
    const keysTab = tabs.find(t => {
      const text = t.textContent?.toUpperCase() || '';
      return text === 'KEYS' || text.includes('KEYS');
    });
    if (keysTab) {
      console.log('Found keys tab');
      keysTab.click();
    }
  });
  await sleep(3000);
  await snap(page, 'key-03-keys-tab');
  
  // Click ADD KEY button
  console.log('[4] Clicking ADD KEY...');
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const addKeyBtn = btns.find(b => /add key/i.test(b.textContent));
    if (addKeyBtn) addKeyBtn.click();
  });
  await sleep(2000);
  await snap(page, 'key-04-add-key-menu');
  
  // Click "Create new key"
  console.log('[5] Clicking Create new key...');
  await page.evaluate(() => {
    const items = [...document.querySelectorAll('[role="menuitem"], button, a, span')];
    const createItem = items.find(i => /create new key/i.test(i.textContent));
    if (createItem) createItem.click();
  });
  await sleep(3000);
  await snap(page, 'key-05-key-type-dialog');
  
  // Make sure JSON is selected and click CREATE
  console.log('[6] Selecting JSON and clicking CREATE...');
  await page.evaluate(() => {
    // Click JSON radio button
    const radios = [...document.querySelectorAll('mat-radio-button, input[type="radio"], [role="radio"]')];
    const jsonRadio = radios.find(r => {
      const label = r.textContent || r.getAttribute('aria-label') || '';
      return label.toUpperCase().includes('JSON');
    });
    if (jsonRadio) jsonRadio.click();
  });
  await sleep(1000);
  
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const createBtn = btns.find(b => {
      const text = b.textContent?.trim().toUpperCase();
      return text === 'CREATE';
    });
    if (createBtn) createBtn.click();
  });
  await sleep(5000);
  await snap(page, 'key-06-key-created');
  
  // Check for downloaded key
  console.log('\n[7] Checking for downloaded key...');
  const downloadDir = '/Users/nico/Downloads';
  const files = fs.readdirSync(downloadDir);
  const keyFiles = files.filter(f => f.includes(PROJECT_ID) && f.endsWith('.json'));
  
  if (keyFiles.length > 0) {
    // Get the newest one
    const keyFile = keyFiles.sort((a, b) => {
      const statA = fs.statSync(`${downloadDir}/${a}`);
      const statB = fs.statSync(`${downloadDir}/${b}`);
      return statB.mtimeMs - statA.mtimeMs;
    })[0];
    
    console.log('  ✓ Found key file:', keyFile);
    
    // Copy to project
    const srcPath = `${downloadDir}/${keyFile}`;
    const destPath = '/Users/nico/vibe-portfolio/service-account.json';
    fs.copyFileSync(srcPath, destPath);
    console.log('  ✓ Copied to:', destPath);
    
    // Verify
    const keyContent = JSON.parse(fs.readFileSync(destPath, 'utf8'));
    console.log('  ✓ Service Account Email:', keyContent.client_email);
  } else {
    console.log('  ! No key file found in Downloads');
    console.log('  ! Files in Downloads:', files.filter(f => f.endsWith('.json')).slice(0, 5));
  }
  
  console.log('\n====================================');
  console.log('  DONE!');
  console.log('====================================\n');
}

main().catch(e => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
