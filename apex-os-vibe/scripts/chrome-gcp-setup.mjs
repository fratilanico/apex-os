#!/usr/bin/env node
/**
 * Chrome DevTools Protocol automation for GCP Vertex AI setup
 * Navigates Chrome to Google Cloud Console
 */

const CDP_URL = 'http://localhost:9222';

async function getPages() {
  const response = await fetch(`${CDP_URL}/json/list`);
  return response.json();
}

async function navigateTo(pageId, url) {
  const wsUrl = `ws://localhost:9222/devtools/page/${pageId}`;
  
  // Use Node's WebSocket or a simple HTTP approach
  const response = await fetch(`${CDP_URL}/json/navigate?${new URLSearchParams({ url })}`, {
    method: 'GET'
  });
  
  // Alternative: direct CDP command
  const cdpResponse = await fetch(`${CDP_URL}/json/version`);
  const version = await cdpResponse.json();
  
  console.log('Browser:', version.Browser);
  console.log('Navigating to:', url);
  
  return { success: true, url };
}

async function main() {
  try {
    // Get current pages
    const pages = await getPages();
    console.log('Current tabs:', pages.length);
    
    if (pages.length === 0) {
      console.error('No Chrome tabs available');
      process.exit(1);
    }
    
    const targetPage = pages[0];
    console.log('Target tab:', targetPage.title, targetPage.url);
    
    // Navigate to Google Cloud Console
    const gcpUrl = 'https://console.cloud.google.com/vertex-ai?project=newsletter-source-hub';
    
    // Use CDP to navigate
    const WebSocket = (await import('ws')).default;
    const ws = new WebSocket(targetPage.webSocketDebuggerUrl);
    
    ws.on('open', () => {
      console.log('Connected to Chrome DevTools');
      
      // Send navigate command
      ws.send(JSON.stringify({
        id: 1,
        method: 'Page.navigate',
        params: { url: gcpUrl }
      }));
    });
    
    ws.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      console.log('CDP Response:', msg);
      
      if (msg.id === 1) {
        console.log('\n===========================================');
        console.log('SUCCESS: Chrome navigated to Google Cloud Console');
        console.log('URL:', gcpUrl);
        console.log('===========================================\n');
        console.log('NEXT STEPS:');
        console.log('1. Sign in with your Google account if prompted');
        console.log('2. Once logged in, come back here');
        ws.close();
      }
    });
    
    ws.on('error', (err) => {
      console.error('WebSocket error:', err);
    });
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
