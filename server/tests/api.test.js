const assert = require('assert');

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

async function runTests() {
  let passed = 0;

  console.log(`Starting API tests at ${BASE_URL}\n`);

  // TEST 1 — GET /api/pledges returns HTTP 200 and an array
  try {
    const res = await fetch(`${BASE_URL}/api/pledges`);
    assert.strictEqual(res.ok, true, 'Response should be ok');
    const data = await res.json();
    assert.strictEqual(Array.isArray(data), true, 'Data should be an array');
    console.log('PASS: TEST 1 - GET /api/pledges returns HTTP 200 and an array');
    passed++;
  } catch (err) {
    console.error('FAIL: TEST 1 - GET /api/pledges', err.message);
  }

  // TEST 2 — POST /api/pledges with valid data returns 201
  try {
    const res = await fetch(`${BASE_URL}/api/pledges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'APITestUser', pledge: 'I will reduce my carbon footprint daily.' })
    });
    assert.strictEqual(res.status, 201, 'Status should be 201');
    console.log('PASS: TEST 2 - POST /api/pledges with valid data returns 201');
    passed++;
  } catch (err) {
    console.error('FAIL: TEST 2 - POST /api/pledges with valid data', err.message);
  }

  // TEST 3 — POST /api/pledges rejects pledge over 120 chars
  try {
    const res = await fetch(`${BASE_URL}/api/pledges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'APITestUser', pledge: 'x'.repeat(121) })
    });
    assert.strictEqual(res.status, 400, 'Status should be 400');
    console.log('PASS: TEST 3 - POST /api/pledges rejects pledge over 120 chars');
    passed++;
  } catch (err) {
    console.error('FAIL: TEST 3 - POST /api/pledges rejects long pledge', err.message);
  }

  // TEST 4 — POST /api/pledges strips HTML tags from pledge
  try {
    const res = await fetch(`${BASE_URL}/api/pledges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'APITestUser', pledge: '<b>Bold</b> eco pledge' })
    });
    assert.strictEqual(res.status, 201, 'Status should be 201');
    const data = await res.json();
    assert.ok(!data.pledge.pledge.includes('<b>') && !data.pledge.pledge.includes('</b>'), 'HTML tags should be stripped');
    console.log('PASS: TEST 4 - POST /api/pledges strips HTML tags');
    passed++;
  } catch (err) {
    console.error('FAIL: TEST 4 - POST /api/pledges strips HTML tags', err.message);
  }

  // TEST 5 — GET /api/leaderboard returns HTTP 200 and an array (<= 10 items)
  try {
    const res = await fetch(`${BASE_URL}/api/leaderboard`);
    assert.strictEqual(res.ok, true, 'Response should be ok');
    const data = await res.json();
    assert.strictEqual(Array.isArray(data), true, 'Data should be an array');
    assert.ok(data.length <= 10, 'Array length should be <= 10');
    console.log('PASS: TEST 5 - GET /api/leaderboard returns HTTP 200 and an array');
    passed++;
  } catch (err) {
    console.error('FAIL: TEST 5 - GET /api/leaderboard', err.message);
  }

  // TEST 6 — POST /api/leaderboard with valid data returns 200 or 201
  try {
    const res = await fetch(`${BASE_URL}/api/leaderboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'APITestUser', score: 75 })
    });
    assert.ok(res.status === 200 || res.status === 201, 'Status should be 200 or 201');
    console.log('PASS: TEST 6 - POST /api/leaderboard with valid data returns 200/201');
    passed++;
  } catch (err) {
    console.error('FAIL: TEST 6 - POST /api/leaderboard with valid data', err.message);
  }

  console.log(`\nTotal passed: ${passed} / 6`);
}

runTests();
