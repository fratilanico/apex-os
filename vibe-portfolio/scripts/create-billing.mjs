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
  console.log('====== CREATE BILLING ACCOUNT ======\n');
  
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
  
  // Remove the Status filter first to see ALL accounts
  console.log('Checking all billing accounts (removing Active filter)...');
  await page.goto('https://console.cloud.google.com/billing', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });
  await sleep(3000);
  
  // Remove the "Status: Active" filter
  await page.evaluate(() => {
    const filterChip = document.querySelector('[aria-label*="Remove"] , .filter-chip-close, mat-chip button');
    if (filterChip) filterChip.click();
  });
  await sleep(2000);
  await snap(page, 'create-01-all-accounts');
  
  // Click "+ Create account"
  console.log('Clicking Create account...');
  await page.evaluate(() => {
    const links = [...document.querySelectorAll('a, button')];
    const createLink = links.find(l => l.textContent.includes('Create account'));
    if (createLink) createLink.click();
  });
  await sleep(5000);
  await snap(page, 'create-02-create-form');
  
  // Check current URL
  console.log('URL:', page.url());
  
  // If we're on a create billing account page
  const content = await page.content();
  
  if (content.includes('Country') || content.includes('country')) {
    console.log('On billing account creation form...');
    
    // Fill the account name
    await page.evaluate(() => {
      const nameInput = document.querySelector('input[formcontrolname="name"], input[name="name"], input[aria-label*="name"]');
      if (nameInput) {
        nameInput.value = 'Vibe Academy Credits';
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await sleep(1000);
    await snap(page, 'create-03-name-filled');
  }
  
  // Also check for free trial flow
  if (content.includes('free trial') || content.includes('Free Trial') || content.includes('$300')) {
    console.log('\nFree trial detected!');
    await snap(page, 'create-04-free-trial');
  }
  
  console.log('\n====================================');
  console.log('Screenshots saved to:', SCREENSHOTS);
  console.log('\n*** MANUAL ACTION REQUIRED ***');
  console.log('Please complete the billing account creation in Chrome:');
  console.log('1. Fill in payment details');
  console.log('2. Accept terms');
  console.log('3. Create the account');
  console.log('\nAfter creating, link it to project:', PROJECT_ID);
}

main().catch(e => console.error('ERROR:', e.message));
