#!/usr/bin/env node
/**
 * Take a screenshot of current Chrome tab
 */

import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';

const CDP_URL = 'http://127.0.0.1:9222';

async function getPages() {
  const response = await fetch(`${CDP_URL}/json/list`);
  return response.json();
}

async function takeScreenshot(outputPath) {
  const pages = await getPages();
  
  if (pages.length === 0) {
    console.error('No Chrome tabs available');
    process.exit(1);
  }
  
  const targetPage = pages[0];
  console.log('Taking screenshot of:', targetPage.title);
  console.log('URL:', targetPage.url);
  
  const ws = new WebSocket(targetPage.webSocketDebuggerUrl);
  
  return new Promise((resolve, reject) => {
    ws.on('open', () => {
      // First, wait a moment for page to load
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 1,
          method: 'Page.captureScreenshot',
          params: { format: 'png', quality: 80 }
        }));
      }, 2000);
    });
    
    ws.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      
      if (msg.id === 1 && msg.result && msg.result.data) {
        const buffer = Buffer.from(msg.result.data, 'base64');
        fs.writeFileSync(outputPath, buffer);
        console.log('Screenshot saved to:', outputPath);
        ws.close();
        resolve(outputPath);
      } else if (msg.error) {
        console.error('CDP Error:', msg.error);
        ws.close();
        reject(msg.error);
      }
    });
    
    ws.on('error', reject);
  });
}

const outputPath = process.argv[2] || '/Users/nico/vibe-portfolio/gcp-screenshot.png';
takeScreenshot(outputPath).catch(console.error);
