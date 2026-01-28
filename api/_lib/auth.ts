import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Sets up Google Cloud authentication for Vertex AI
 * Handles both local development (service-account.json file) and 
 * Vercel production (base64 encoded env var)
 */
export function setupGoogleAuth(): void {
  // If already set and pointing to a valid file, skip
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (fs.existsSync(credPath)) {
      return;
    }
  }

  // Check for base64 encoded credentials (Vercel production)
  const base64Creds = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
  if (base64Creds) {
    try {
      const decoded = Buffer.from(base64Creds, 'base64').toString('utf8');
      const tempPath = path.join(os.tmpdir(), 'gcp-service-account.json');
      fs.writeFileSync(tempPath, decoded);
      process.env.GOOGLE_APPLICATION_CREDENTIALS = tempPath;
      console.log('[Auth] Service account loaded from GOOGLE_APPLICATION_CREDENTIALS_BASE64');
      return;
    } catch (error) {
      console.error('[Auth] Failed to decode base64 credentials:', error);
    }
  }

  // Check for local service account file
  const localPath = path.join(process.cwd(), 'service-account.json');
  if (fs.existsSync(localPath)) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = localPath;
    console.log('[Auth] Service account loaded from local file');
    return;
  }

  console.warn('[Auth] No Google Cloud credentials found!');
}
