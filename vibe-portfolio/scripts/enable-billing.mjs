#!/usr/bin/env node
import puppeteer from 'puppeteer-core';
import fs from 'fs';

const PROJECT_ID = 'newsletter-source-hub';
const SCREENSHOTS = '/Users/nico/vibe-portfolio/gcp-screenshots';

async function snap(page, name) {
  await page.screenshot({ path: `${SCREENSHOTS}/${name}.png` });
  console.log(`[SNAP] ${name}`);
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('====== ENABLE BILLING FOR VERTEX AI ======\n');
  
  const versionRes = await fetch('http://127.0.0.1:9222/json/version');
  const versionInfo = await versionRes.json();
  const wsUrl = versionInfo.webSocketDebuggerUrl.replace('localhost', '127.0.0.1');
  
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsUrl,
    defaultViewport: null
  });
  
  const pages = await browser.pages();
  let page = pages.find(p => p.url().includes('console.cloud.google.com'));
  
  if (!page) {
    page = await browser.newPage();
  }
  
  console.log('Navigating to Billing page...');
  await page.goto(`https://console.cloud.google.com/billing/linkedaccount?project=${PROJECT_ID}`, {
    waitUntil: 'networkidle2',
    timeout: 60000
  });
  await sleep(5000);
  await snap(page, 'billing-01-page');
  
  console.log('\nCurrent URL:', page.url());
  
  // Check page content
  const content = await page.content();
  if (content.includes('Link a billing account') || content.includes('LINK A BILLING ACCOUNT')) {
    console.log('\n!! BILLING NOT LINKED !!');
    console.log('Clicking "Link a billing account"...');
    
    await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button, a')];
      const linkBtn = btns.find(b => /link.*billing/i.test(b.textContent));
      if (linkBtn) linkBtn.click();
    });
    await sleep(3000);
    await snap(page, 'billing-02-link-dialog');
    
    // Select billing account if dropdown appears
    await page.evaluate(() => {
      const selects = [...document.querySelectorAll('select, mat-select, [role="listbox"]')];
      if (selects.length > 0) selects[0].click();
    });
    await sleep(2000);
    
    // Click first billing account option
    await page.evaluate(() => {
      const options = [...document.querySelectorAll('[role="option"], mat-option, option')];
      if (options.length > 0) options[0].click();
    });
    await sleep(2000);
    await snap(page, 'billing-03-account-selected');
    
    // Click Set Account / Link / Confirm
    await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button')];
      const confirmBtn = btns.find(b => /set account|link|confirm|save/i.test(b.textContent));
      if (confirmBtn) confirmBtn.click();
    });
    await sleep(5000);
    await snap(page, 'billing-04-linked');
    
  } else if (content.includes('Billing account') && !content.includes('not linked')) {
    console.log('Billing appears to be already linked!');
  }
  
  // Also go to the direct billing enable page
  console.log('\nNavigating to billing enable page...');
  await page.goto(`https://console.developers.google.com/billing/enable?project=${PROJECT_ID}`, {
    waitUntil: 'networkidle2',
    timeout: 60000
  });
  await sleep(5000);
  await snap(page, 'billing-05-enable-page');
  
  console.log('\n====================================');
  console.log('Check the Chrome window to complete billing setup');
  console.log('Screenshots saved to:', SCREENSHOTS);
}

main().catch(e => console.error('ERROR:', e.message));
