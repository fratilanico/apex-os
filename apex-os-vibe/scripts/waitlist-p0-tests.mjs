import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const heroPath = path.join(root, 'components', 'TerminalHero.tsx');
const submitPath = path.join(root, 'lib', 'waitlist', 'submitEntry.ts');
const notifyPath = path.join(root, 'lib', 'notifications', 'waitlist.ts');

const hero = fs.readFileSync(heroPath, 'utf8');
const submit = fs.readFileSync(submitPath, 'utf8');
const notify = fs.readFileSync(notifyPath, 'utf8');

const expectIncludes = (haystack, needle, label) => {
  assert.ok(haystack.includes(needle), `${label} missing: ${needle}`);
};

const expectRegex = (haystack, regex, label) => {
  assert.ok(regex.test(haystack), `${label} missing: ${regex}`);
};

try {
  expectRegex(submit, /REQUIRED_FIELDS\s*=\s*\[[^\]]*'email'[^\]]*\]/, 'Required fields');
  expectRegex(hero, /type="email"[\s\S]*required/, 'Email required in contact');
  expectIncludes(hero, "command === 'contact'", 'Contact command');
  expectIncludes(hero, 'setShowForm(true)', 'Contact opens form');
  expectIncludes(hero, 'setModule00Unlocked(true)', 'Module 00 unlock');
  expectIncludes(hero, 'MODULE 00 ACCESS GRANTED', 'Unlock notice');
  expectIncludes(hero, 'Exit Notification', 'Exit notification control');
  expectIncludes(notify, 'to: payload.email', 'User email notify');
  expectIncludes(notify, 'payload.email', 'Payload email usage');

  console.log('[P0] Waitlist tests: PASS');
  process.exit(0);
} catch (error) {
  console.error('[P0] Waitlist tests: FAIL');
  console.error(error.message);
  process.exit(1);
}
