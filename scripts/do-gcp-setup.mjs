#!/usr/bin/env node
import puppeteer from 'puppeteer-core';
import fs from 'fs';

const PROJECT_ID = 'newsletter-source-hub';
const SA_NAME = 'vibe-academy-vertex';
const SCREENSHOTS = '/Users/nico/vibe-portfolio/gcp-screenshots';

fs.mkdirSync(SCREENSHOTS, { recursive: true });

async function snap(page, name) {
  await page.screenshot({ path: `${SCREENSHOTS}/${name}.png` });
  console.log(`  [SNAP] ${name}`);
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('\n====== GCP VERTEX AI SETUP ======\n');
  
  // Connect to the GCP console page directly
  const pageId = '3EAF6E63A7FF7A08E5BA84CAB8936737';
  const browser = await puppeteer.connect({
    browserWSEndpoint: `ws://127.0.0.1:9222/devtools/browser/be3d34ba-8b60-47de-81a7-c250505d8e17`,
    defaultViewport: null
  });
  
  const pages = await browser.pages();
  let page = pages.find(p => p.url().includes('console.cloud.google.com') && !p.url().includes('RotateCookies'));
  
  if (!page) {
    console.log('No GCP page found, creating new one...');
    page = await browser.newPage();
    await page.goto('https://console.cloud.google.com/?project=' + PROJECT_ID);
    await sleep(5000);
  }
  
  console.log('Current URL:', page.url());
  await snap(page, '00-current-state');
  
  // ========== STEP 1: Enable Vertex AI API ==========
  console.log('\n[STEP 1] Enabling Vertex AI API...');
  await page.goto(`https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=${PROJECT_ID}`, {
    waitUntil: 'networkidle0',
    timeout: 60000
  });
  await sleep(3000);
  await snap(page, '01-vertex-api-page');
  
  const apiPageContent = await page.content();
  if (apiPageContent.toLowerCase().includes('manage') || apiPageContent.toLowerCase().includes('api enabled')) {
    console.log('  ✓ Vertex AI API is ALREADY ENABLED');
  } else {
    console.log('  Clicking Enable button...');
    await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button')];
      const enableBtn = btns.find(b => /^enable$/i.test(b.textContent.trim()));
      if (enableBtn) enableBtn.click();
    });
    await sleep(8000);
    await snap(page, '01b-api-enabling');
    console.log('  ✓ Enable clicked, waiting for activation...');
    await sleep(5000);
  }
  
  // ========== STEP 2: Create Service Account ==========
  console.log('\n[STEP 2] Creating Service Account...');
  await page.goto(`https://console.cloud.google.com/iam-admin/serviceaccounts/create?project=${PROJECT_ID}`, {
    waitUntil: 'networkidle0',
    timeout: 60000
  });
  await sleep(3000);
  await snap(page, '02-sa-create-page');
  
  // Fill service account name
  console.log('  Entering service account name...');
  await page.evaluate((name) => {
    const input = document.querySelector('input[formcontrolname="displayName"], input[formcontrolname="accountId"], input[aria-label*="name"], input#service-account-name');
    if (!input) {
      // Try finding by placeholder or any text input
      const inputs = [...document.querySelectorAll('input[type="text"]')];
      const nameInput = inputs[0];
      if (nameInput) {
        nameInput.focus();
        nameInput.value = name;
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } else {
      input.focus();
      input.value = name;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, SA_NAME);
  await sleep(1500);
  await snap(page, '02b-sa-name-entered');
  
  // Click Create and Continue
  console.log('  Clicking Create and Continue...');
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const createBtn = btns.find(b => /create.*continue|continue/i.test(b.textContent));
    if (createBtn) createBtn.click();
  });
  await sleep(4000);
  await snap(page, '02c-sa-created');
  
  // ========== STEP 3: Grant Vertex AI User Role ==========
  console.log('\n[STEP 3] Granting Vertex AI User role...');
  
  // Click role dropdown
  await page.evaluate(() => {
    const dropdown = document.querySelector('[aria-label*="role"], [aria-label*="Role"], mat-select, .role-dropdown');
    if (dropdown) dropdown.click();
  });
  await sleep(2000);
  
  // Type to filter
  await page.keyboard.type('Vertex AI User');
  await sleep(2000);
  await snap(page, '03-role-dropdown');
  
  // Select role
  await page.evaluate(() => {
    const options = [...document.querySelectorAll('[role="option"], mat-option, li')];
    const vertexOption = options.find(o => o.textContent.includes('Vertex AI User'));
    if (vertexOption) vertexOption.click();
  });
  await sleep(2000);
  
  // Click Continue
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const continueBtn = btns.find(b => /continue/i.test(b.textContent.trim()));
    if (continueBtn) continueBtn.click();
  });
  await sleep(3000);
  await snap(page, '03b-role-assigned');
  
  // Click Done
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const doneBtn = btns.find(b => /^done$/i.test(b.textContent.trim()));
    if (doneBtn) doneBtn.click();
  });
  await sleep(3000);
  await snap(page, '03c-sa-complete');
  
  // ========== STEP 4: Create JSON Key ==========
  console.log('\n[STEP 4] Creating JSON key...');
  
  // Go to service accounts list and click on our SA
  await page.goto(`https://console.cloud.google.com/iam-admin/serviceaccounts?project=${PROJECT_ID}`, {
    waitUntil: 'networkidle0',
    timeout: 60000
  });
  await sleep(3000);
  await snap(page, '04-sa-list');
  
  // Click on our service account
  await page.evaluate((name) => {
    const links = [...document.querySelectorAll('a, [role="link"]')];
    const saLink = links.find(l => l.textContent.includes(name));
    if (saLink) saLink.click();
  }, SA_NAME);
  await sleep(3000);
  
  // Click Keys tab
  await page.evaluate(() => {
    const tabs = [...document.querySelectorAll('[role="tab"], a, button')];
    const keysTab = tabs.find(t => /keys/i.test(t.textContent));
    if (keysTab) keysTab.click();
  });
  await sleep(2000);
  await snap(page, '04b-keys-tab');
  
  // Add Key -> Create new key
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const addKeyBtn = btns.find(b => /add key/i.test(b.textContent));
    if (addKeyBtn) addKeyBtn.click();
  });
  await sleep(2000);
  
  await page.evaluate(() => {
    const items = [...document.querySelectorAll('[role="menuitem"], button, a')];
    const createKeyItem = items.find(i => /create new key/i.test(i.textContent));
    if (createKeyItem) createKeyItem.click();
  });
  await sleep(2000);
  await snap(page, '04c-key-dialog');
  
  // Select JSON and Create
  await page.evaluate(() => {
    // Ensure JSON is selected
    const jsonRadio = document.querySelector('input[value="JSON"], mat-radio-button');
    if (jsonRadio) jsonRadio.click();
  });
  await sleep(1000);
  
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const createBtn = btns.find(b => /^create$/i.test(b.textContent.trim()));
    if (createBtn) createBtn.click();
  });
  await sleep(5000);
  await snap(page, '04d-key-created');
  
  console.log('\n====================================');
  console.log('  ✓ SETUP COMPLETE!');
  console.log('====================================');
  console.log('\nJSON key should be in ~/Downloads/');
  console.log('Screenshots saved to:', SCREENSHOTS);
  
  // Check downloads
  const downloads = fs.readdirSync('/Users/nico/Downloads').filter(f => f.includes(PROJECT_ID) && f.endsWith('.json'));
  if (downloads.length > 0) {
    console.log('\n✓ Found key file:', downloads[downloads.length - 1]);
    const keyPath = `/Users/nico/Downloads/${downloads[downloads.length - 1]}`;
    console.log('  Path:', keyPath);
    
    // Copy to project
    const destPath = '/Users/nico/vibe-portfolio/service-account.json';
    fs.copyFileSync(keyPath, destPath);
    console.log('  Copied to:', destPath);
  }
}

main().catch(e => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
