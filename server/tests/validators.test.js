const assert = require('assert');
const { validatePledgeInput, sanitizeText, PROFANITY_LIST } = require('../validators/pledgeValidator');
const { validateScoreInput } = require('../validators/scoreValidator');

let passed = 0;

function testValidPledge() {
  const body = { name: 'TestUser', pledge: 'I will recycle daily.' };
  const result = validatePledgeInput(body);
  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.errors.length, 0);
  console.log('PASS: testValidPledge');
  passed++;
}

function testMissingName() {
  const body = { pledge: 'valid pledge' };
  const result = validatePledgeInput(body);
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.length > 0);
  console.log('PASS: testMissingName');
  passed++;
}

function testEmptyName() {
  const body = { name: '   ', pledge: 'valid pledge' };
  const result = validatePledgeInput(body);
  assert.strictEqual(result.isValid, false);
  console.log('PASS: testEmptyName');
  passed++;
}

function testPledgeOver120Chars() {
  const body = { name: 'User', pledge: 'x'.repeat(121) };
  const result = validatePledgeInput(body);
  assert.strictEqual(result.isValid, false);
  console.log('PASS: testPledgeOver120Chars');
  passed++;
}

function testPledgeExactly120Chars() {
  const body = { name: 'User', pledge: 'x'.repeat(120) };
  const result = validatePledgeInput(body);
  assert.strictEqual(result.isValid, true);
  console.log('PASS: testPledgeExactly120Chars');
  passed++;
}

function testPledgeWithHTMLFailsSanitization() {
  const body = { name: 'User', pledge: '<script></script>' };
  const result = validatePledgeInput(body);
  assert.strictEqual(result.isValid, false);
  console.log('PASS: testPledgeWithHTMLFailsSanitization');
  passed++;
}

function testSanitizeTextRemovesHTML() {
  const result = sanitizeText('<b>hello</b> world');
  assert.strictEqual(result, 'hello world');
  console.log('PASS: testSanitizeTextRemovesHTML');
  passed++;
}

function testSanitizeTextRemovesJSProtocol() {
  const result = sanitizeText('javascript:alert(1)');
  assert.ok(!result.includes('javascript:'));
  console.log('PASS: testSanitizeTextRemovesJSProtocol');
  passed++;
}

function testSanitizeTextRemovesOnclick() {
  const result = sanitizeText('text onclick=evil()');
  assert.ok(!result.includes('onclick'));
  console.log('PASS: testSanitizeTextRemovesOnclick');
  passed++;
}

function testValidScoreInput() {
  const body = { name: 'User', score: 75 };
  const result = validateScoreInput(body);
  assert.strictEqual(result.isValid, true);
  console.log('PASS: testValidScoreInput');
  passed++;
}

function testScoreOver100() {
  const body = { name: 'User', score: 150 };
  const result = validateScoreInput(body);
  assert.strictEqual(result.isValid, false);
  console.log('PASS: testScoreOver100');
  passed++;
}

function testScoreExactly0And100() {
  assert.strictEqual(validateScoreInput({ name: 'U', score: 0 }).isValid, true);
  assert.strictEqual(validateScoreInput({ name: 'U', score: 100 }).isValid, true);
  console.log('PASS: testScoreExactly0And100');
  passed++;
}

try {
  testValidPledge();
  testMissingName();
  testEmptyName();
  testPledgeOver120Chars();
  testPledgeExactly120Chars();
  testPledgeWithHTMLFailsSanitization();
  testSanitizeTextRemovesHTML();
  testSanitizeTextRemovesJSProtocol();
  testSanitizeTextRemovesOnclick();
  testValidScoreInput();
  testScoreOver100();
  testScoreExactly0And100();
  console.log(`Total: ${passed}/12 passed`);
} catch (err) {
  console.error('FAIL: ', err.message);
  process.exit(1);
}
