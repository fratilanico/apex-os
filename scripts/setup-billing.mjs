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
  console.log('====== SETUP BILLING ACCOUNT ======\n');
  
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
  
  // Go to Billing overview to see all billing accounts
  console.log('Navigating to Billing overview...');
  await page.goto('https://console.cloud.google.com/billing', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });
  await sleep(5000);
  await snap(page, 'setup-01-billing-overview');
  
  console.log('URL:', page.url());
  
  // Check for existing billing accounts or free trial
  const content = await page.content();
  
  if (content.includes('free trial') || content.includes('Free trial') || content.includes('$300')) {
    console.log('Found free trial / $300 credits!');
  }
  
  if (content.includes('Create account') || content.includes('CREATE ACCOUNT')) {
    console.log('Need to create billing account...');
    await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button, a')];
      const createBtn = btns.find(b => /create.*account/i.test(b.textContent));
      if (createBtn) createBtn.click();
    });
    await sleep(3000);
    await snap(page, 'setup-02-create-account');
  }
  
  // Try going to the free trial activation page
  console.log('\nNavigating to free trial page...');
  await page.goto('https://console.cloud.google.com/freetrial', {
    waitUntil: 'networkidle2', 
    timeout: 60000
  });
  await sleep(5000);
  await snap(page, 'setup-03-free-trial');
  
  // Check billing accounts list
  console.log('\nNavigating to billing accounts list...');
  await page.goto('https://console.cloud.google.com/billing?organizationId=0', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });
  await sleep(5000);
  await snap(page, 'setup-04-accounts-list');
  
  console.log('\n====================================');
  console.log('Screenshots saved to:', SCREENSHOTS);
  console.log('\nPlease check the Chrome window to:');
  console.log('1. Activate free trial or create billing account');
  console.log('2. Link billing account to project newsletter-source-hub');
}

main().catch(e => console.error('ERROR:', e.message));
