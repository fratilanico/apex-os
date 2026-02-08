import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const waitlistPath = path.join(root, 'pages', 'Waitlist.tsx');
const socialPath = path.join(root, 'components', 'SocialHub.tsx');
const brandingPath = path.join(root, 'components', 'TerminalBranding.tsx');

const waitlist = fs.readFileSync(waitlistPath, 'utf8');
const social = fs.readFileSync(socialPath, 'utf8');
const branding = fs.readFileSync(brandingPath, 'utf8');

const expectIncludes = (haystack, needle, label) => {
  assert.ok(haystack.includes(needle), `${label} missing: ${needle}`);
};

try {
  expectIncludes(waitlist, 'const TELEMETRY', 'Telemetry array');
  expectIncludes(waitlist, 'GitHub Octoverse', 'Telemetry GitHub source');
  expectIncludes(waitlist, 'METR 2025', 'Telemetry METR source');
  expectIncludes(waitlist, 'Accenture 2025', 'Telemetry Accenture source');
  expectIncludes(waitlist, 'SemiAnalysis 2026', 'Telemetry SemiAnalysis source');
  expectIncludes(waitlist, 'const PROGRESS', 'Progress rails');
  expectIncludes(waitlist, 'const MODULE_TRACK', 'Module track');
  expectIncludes(waitlist, 'const EXECUTION_LOG', 'Execution ledger');
  expectIncludes(waitlist, 'Great Divide', 'Old vs APEX section');
  expectIncludes(social, 'Signal Entry Points', 'Signal entry hub');
  expectIncludes(branding, 'STATUS ACTIVE', 'Branding status');

  console.log('[P1] Waitlist tests: PASS');
  process.exit(0);
} catch (error) {
  console.error('[P1] Waitlist tests: FAIL');
  console.error(error.message);
  process.exit(1);
}
