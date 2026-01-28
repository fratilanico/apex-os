#!/usr/bin/env node
import puppeteer from 'puppeteer-core';

const SCREENSHOTS = '/Users/nico/vibe-portfolio/gcp-screenshots';

async function snap(page, name) {
  await page.screenshot({ path: `${SCREENSHOTS}/${name}.png` });
  console.log(`[SNAP] ${name}`);
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('====== CONTINUE BILLING SETUP ======\n');
  
  const versionRes = await fetch('http://127.0.0.1:9222/json/version');
  const versionInfo = await versionRes.json();
  const wsUrl = versionInfo.webSocketDebuggerUrl.replace('localhost', '127.0.0.1');
  
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsUrl,
    defaultViewport: null
  });
  
  const pages = await browser.pages();
  let page = pages.find(p => p.url().includes('billing'));
  
  if (!page) {
    page = pages[0];
  }
  
  console.log('URL:', page.url());
  await snap(page, 'cont-00-start');
  
  // Change name to "Vibe Academy Credits"
  console.log('Setting billing account name...');
  await page.evaluate(() => {
    const nameInput = document.querySelector('input[type="text"]');
    if (nameInput) {
      nameInput.value = '';
      nameInput.focus();
    }
  });
  await page.keyboard.type('Vibe Academy Credits');
  await sleep(1000);
  await snap(page, 'cont-01-name-set');
  
  // Click Continue
  console.log('Clicking Continue...');
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const continueBtn = btns.find(b => b.textContent.includes('Continue'));
    if (continueBtn) continueBtn.click();
  });
  await sleep(5000);
  await snap(page, 'cont-02-after-continue');
  
  // Check what's next
  const content = await page.content();
  console.log('URL:', page.url());
  
  if (content.includes('payment') || content.includes('Payment') || content.includes('card')) {
    console.log('\n*** PAYMENT DETAILS REQUIRED ***');
    console.log('Please enter your payment card details in Chrome');
  } else if (content.includes('free trial') || content.includes('Free trial')) {
    console.log('\n*** FREE TRIAL AVAILABLE ***');
    // Try to activate free trial
    await page.evaluate(() => {
      const btns = [...document.querySelectorAll('button, a')];
      const trialBtn = btns.find(b => /start.*free|activate|trial/i.test(b.textContent));
      if (trialBtn) trialBtn.click();
    });
    await sleep(3000);
    await snap(page, 'cont-03-free-trial');
  }
  
  console.log('\nScreenshots in:', SCREENSHOTS);
}

main().catch(e => console.error('ERROR:', e.message));
