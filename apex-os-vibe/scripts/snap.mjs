#!/usr/bin/env node
import WebSocket from 'ws';
import fs from 'fs';

const pageId = process.argv[2] || '05DD52FC49A2337FD3093510BA0A288C';
const output = process.argv[3] || '/Users/nico/vibe-portfolio/snap.png';

const ws = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${pageId}`);

ws.on('open', () => {
  console.log('Connected, taking screenshot...');
  ws.send(JSON.stringify({
    id: 1,
    method: 'Page.captureScreenshot',
    params: { format: 'png' }
  }));
});

ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  if (msg.id === 1 && msg.result?.data) {
    fs.writeFileSync(output, Buffer.from(msg.result.data, 'base64'));
    console.log('Saved:', output);
    process.exit(0);
  }
});

ws.on('error', (e) => { console.error('Error:', e); process.exit(1); });
setTimeout(() => { console.log('Timeout'); process.exit(1); }, 5000);
