import fetch from 'node-fetch';

const API_URL = process.env.API_URL || 'http://localhost:5174/api/waitlist-notify';

const payload = {
  payload: {
    name: 'Test Founder',
    email: 'founder@example.com',
    phone: '+1 555 000 0000',
    linkedin: 'https://linkedin.com/in/test',
    goal: 'ship',
    notes: 'Testing waitlist notification via Resend',
    company: 'TestCo',
    role: 'Founder',
    industry: 'saas',
    companySize: '2-5',
    experience: '3-5',
    teamSize: '2-5',
    revenueRange: 'pre-revenue',
    fundingStatus: 'bootstrapped',
    timeline: 'immediately',
    biggestChallenge: 'speed',
    ai_score: 88,
    referral_code: 'APEXTEST',
    created_at: new Date().toISOString(),
  },
};

async function main() {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  console.log('Status:', res.status, res.statusText);
  const text = await res.text();
  console.log('Body:', text);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
