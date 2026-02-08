const payload = {
  name: 'Shadow Tester',
  email: 'shadow@test.example',
  phone: '+1 (555) 000-0000',
  linkedin: 'https://linkedin.com/in/shadow',
  company: 'Shadow Labs',
  role: 'Founder',
  industry: 'ai-ml',
  companySize: '2-5',
  experience: '3-5',
  teamSize: '2-5',
  revenueRange: '10k-50k',
  fundingStatus: 'bootstrapped',
  whyJoin: 'Shadow test submission for Module 00 flow validation.',
  biggestChallenge: 'speed',
  timeline: 'immediately',
  goal: 'ship',
  notes: 'Shadow test only. Do not treat as real lead.',
  consent: true,
  platform: 'shadow-test',
};

const required = ['name', 'email', 'goal', 'consent'];
for (const field of required) {
  if (!payload[field]) {
    console.error(`[SHADOW] Missing required field: ${field}`);
    process.exit(1);
  }
}

const target = process.env.WAITLIST_SHADOW_URL || 'http://localhost:3000/api/waitlist-notify';
if (!target) {
  console.log('[SHADOW] WAITLIST_SHADOW_URL not set. Payload validated only.');
  console.log('[SHADOW] Set WAITLIST_SHADOW_URL to POST the submission.');
  process.exit(0);
}

console.log(`[SHADOW] Posting to ${target}`);
const response = await fetch(target, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

const body = await response.text();
if (!response.ok) {
  console.error(`[SHADOW] Request failed: ${response.status}`);
  console.error(body);
  process.exit(1);
}

console.log('[SHADOW] Submission ok');
console.log(body);
