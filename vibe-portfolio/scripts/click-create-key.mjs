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
  const page = pages.find(p => p.url().includes('serviceaccounts'));
  
  if (!page) {
    console.log('ERROR: No service accounts page found');
    return;
  }
  
  console.log('Found page:', page.url());
  await snap(page, 'ck-00-start');
  
  // Click "Create new key" in the dropdown
  console.log('Clicking "Create new key"...');
  const clicked = await page.evaluate(() => {
    // Find the "Create new key" text and click it
    const allText = [...document.querySelectorAll('*')];
    for (const el of allText) {
      if (el.textContent === 'Create new key' && el.childNodes.length === 1) {
        el.click();
        return 'clicked element';
      }
    }
    // Try by role
    const menuItems = [...document.querySelectorAll('[role="menuitem"]')];
    for (const item of menuItems) {
      if (item.textContent.includes('Create new key')) {
        item.click();
        return 'clicked menuitem';
      }
    }
    return 'not found';
  });
  console.log('Click result:', clicked);
  await sleep(3000);
  await snap(page, 'ck-01-after-click');
  
  // Now we should see the key type dialog
  // Select JSON
  console.log('Selecting JSON format...');
  await page.evaluate(() => {
    const radios = [...document.querySelectorAll('mat-radio-button, [role="radio"]')];
    const jsonRadio = radios.find(r => r.textContent && r.textContent.includes('JSON'));
    if (jsonRadio) {
      jsonRadio.click();
      return 'clicked json radio';
    }
    // Try input directly
    const inputs = [...document.querySelectorAll('input[type="radio"]')];
    if (inputs[0]) inputs[0].click();
    return 'clicked first radio';
  });
  await sleep(1000);
  await snap(page, 'ck-02-json-selected');
  
  // Click CREATE button
  console.log('Clicking CREATE...');
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const createBtn = btns.find(b => {
      const text = b.textContent?.trim();
      return text === 'Create' || text === 'CREATE';
    });
    if (createBtn) {
      createBtn.click();
      return 'clicked';
    }
    return 'not found';
  });
  await sleep(6000);
  await snap(page, 'ck-03-key-created');
  
  // Close confirmation
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const closeBtn = btns.find(b => /close/i.test(b.textContent));
    if (closeBtn) closeBtn.click();
  });
  await sleep(1000);
  
  // Check downloads
  console.log('\nChecking Downloads...');
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
    
    const key = JSON.parse(fs.readFileSync(destPath, 'utf8'));
    console.log('✓ Email:', key.client_email);
    console.log('✓ Project:', key.project_id);
  } else {
    console.log('No key file found in Downloads');
    
    // Maybe check recent files
    const recentJson = files
      .filter(f => f.endsWith('.json'))
      .map(f => ({ name: f, time: fs.statSync(`${downloadDir}/${f}`).mtimeMs }))
      .sort((a, b) => b.time - a.time)
      .slice(0, 5);
    console.log('Recent JSON files:', recentJson.map(f => f.name));
  }
  
  await snap(page, 'ck-04-final');
  console.log('\nDone!');
}

main().catch(e => console.error('ERROR:', e));
