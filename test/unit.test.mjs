/**
 * MONSTER'S GYM — Unit Test Suite
 * Owner: DASTGIR KANTH
 * Focus: Pure utility logic, date calculations, phone normalization, template interpolation, security PIN
 */

import {
  normalizePakistaniPhone,
  isValidPakistaniPhone,
  calculateRenewalExpiry,
  calculateInitialExpiry,
  parseDateString,
  formatDateIso,
  formatDisplayDate,
  interpolateTemplate,
  BASE_MONTHLY_FEE,
  RENEWAL_PERIOD_DAYS,
} from '../src/utils/dateAndPhone.ts';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('=== [UNIT] 1. Phone Normalization & Validation ===');
// Leading zeroes
assert(normalizePakistaniPhone('03001234567') === '923001234567', 'Normalizes 0300 prefix to 92300');
assert(normalizePakistaniPhone('0348-1488937') === '923481488937', 'Strips dashes from Taha Rubyan phone');
assert(normalizePakistaniPhone('0317 776 9001') === '923177769001', 'Strips spaces from Farhan Butt phone');
assert(normalizePakistaniPhone('+923001234567') === '923001234567', 'Strips + from +92 format');
assert(normalizePakistaniPhone('3001234567') === '923001234567', 'Prepends 92 to 10-digit number');

// Phone validity checks
assert(isValidPakistaniPhone('03001234567') === true, 'Valid 11-digit local format');
assert(isValidPakistaniPhone('+923481488937') === true, 'Valid international format');
assert(isValidPakistaniPhone('04235889000') === false, 'Rejects Lahore landline prefix (042)');
assert(isValidPakistaniPhone('+14155552671') === false, 'Rejects US international phone (+1)');
assert(isValidPakistaniPhone('02134567890') === false, 'Rejects Karachi landline prefix (021)');
assert(isValidPakistaniPhone('abc1234567') === false, 'Rejects alphanumeric string');
assert(isValidPakistaniPhone('') === false, 'Rejects empty string');

console.log('\n=== [UNIT] 2. Date Arithmetic & Leap Year Calculations ===');
// 30-day initial expiry
assert(calculateInitialExpiry('2026-01-01') === '2026-01-31', '30 calendar days from Jan 1 is Jan 31');
assert(calculateInitialExpiry('2026-02-01') === '2026-03-03', '30 calendar days from Feb 1 (non-leap year 28 days) is Mar 3');
assert(calculateInitialExpiry('2028-02-01') === '2028-03-02', '30 calendar days from Feb 1 (leap year 2028 with 29 days) is Mar 2');
assert(calculateInitialExpiry('2026-12-15') === '2027-01-14', 'Crosses Gregorian calendar year accurately');

// ISO Parsing & Formatting round-trip
const parsedDate = parseDateString('2026-09-16');
assert(parsedDate.getFullYear() === 2026 && parsedDate.getMonth() === 8 && parsedDate.getDate() === 16, 'parseDateString correctly parses YYYY-MM-DD');
assert(formatDateIso(parsedDate) === '2026-09-16', 'formatDateIso reproduces identical ISO string');

// Display date formatting
assert(formatDisplayDate('2026-09-16').includes('Sep') || formatDisplayDate('2026-09-16').includes('September'), 'formatDisplayDate formats to readable English month');

console.log('\n=== [UNIT] 3. 48-Hour Threshold Window Logic ===');
// Simulated today: 2026-09-16
function checkStatusAtDate(expiryIso, nowIso) {
  const today = parseDateString(nowIso);
  const expiry = parseDateString(expiryIso);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { status: 'EXPIRED', daysRemaining: diffDays };
  if (diffDays <= 2) return { status: 'EXPIRING_SOON', daysRemaining: diffDays };
  return { status: 'ACTIVE', daysRemaining: diffDays };
}

assert(checkStatusAtDate('2026-09-15', '2026-09-16').status === 'EXPIRED', 'Yesterday expiry is EXPIRED');
assert(checkStatusAtDate('2026-09-16', '2026-09-16').status === 'EXPIRING_SOON', 'Today expiry is EXPIRING_SOON (0 days)');
assert(checkStatusAtDate('2026-09-17', '2026-09-16').status === 'EXPIRING_SOON', 'Tomorrow expiry is EXPIRING_SOON (1 day)');
assert(checkStatusAtDate('2026-09-18', '2026-09-16').status === 'EXPIRING_SOON', 'In 2 days expiry is EXPIRING_SOON (2 days)');
assert(checkStatusAtDate('2026-09-19', '2026-09-16').status === 'ACTIVE', 'In 3 days expiry is ACTIVE (3 days)');

console.log('\n=== [UNIT] 4. Overdue Payment Renewal Anchoring ===');
// Scenario: Expired on Sep 10. Member arrives Sep 14 (4 days overdue).
// Mode 1: CURRENT_DATE -> Anchors to payment date (Sep 14 + 30 days = Oct 14)
const currentAnchorResult = calculateRenewalExpiry('2026-09-10', '2026-09-14', 'CURRENT_DATE');
assert(currentAnchorResult === '2026-10-14', 'Overdue renewal with CURRENT_DATE anchors to payment date (+30 days)');

// Mode 2: PREVIOUS_EXPIRY -> Extends previous expiry (Sep 10 + 30 days = Oct 10)
const previousAnchorResult = calculateRenewalExpiry('2026-09-10', '2026-09-14', 'PREVIOUS_EXPIRY');
assert(previousAnchorResult === '2026-10-10', 'Overdue renewal with PREVIOUS_EXPIRY anchors to old expiry (+30 days)');

// Active member renewal -> Always adds 30 days to existing expiry regardless of anchorMode
const activeRenewal = calculateRenewalExpiry('2026-09-25', '2026-09-14', 'CURRENT_DATE');
assert(activeRenewal === '2026-10-25', 'Active member renewal adds 30 days directly to current expiry');

console.log('\n=== [UNIT] 5. Template Interpolation Engine ===');
const sampleTemplate = 'Hello {name}! Pass: {expiry}. Fee: PKR {fee}. Gym: {gymName}. Owner: {ownerName}.';
const rendered = interpolateTemplate(sampleTemplate, {
  name: 'Taha Rubyan',
  expiry: '16 Oct 2026',
  fee: '2,500',
  gymName: "MONSTER'S GYM",
  ownerName: 'DASTGIR KANTH',
});
assert(rendered.includes('Hello Taha Rubyan!'), 'Replaces {name}');
assert(rendered.includes('Pass: 16 Oct 2026.'), 'Replaces {expiry}');
assert(rendered.includes('Fee: PKR 2,500.'), 'Replaces {fee}');
assert(rendered.includes("Gym: MONSTER'S GYM."), 'Replaces {gymName}');
assert(rendered.includes('Owner: DASTGIR KANTH.'), 'Replaces {ownerName}');
assert(!rendered.includes('{'), 'No unreplaced template tags remain');

console.log('\n=== [UNIT] 6. Security PIN Validation Logic ===');
function validatePin(pin) {
  if (!pin || typeof pin !== 'string') return false;
  return /^\d{4}$/.test(pin.trim());
}
assert(validatePin('1234') === true, 'Default 1234 PIN is valid');
assert(validatePin('0000') === true, '0000 PIN is valid');
assert(validatePin('9876') === true, '9876 PIN is valid');
assert(validatePin('123') === false, 'Rejects 3-digit PIN');
assert(validatePin('12345') === false, 'Rejects 5-digit PIN');
assert(validatePin('12a4') === false, 'Rejects letters in PIN');
assert(validatePin('') === false, 'Rejects empty PIN');

console.log('\n----------------------------------------');
console.log(`[UNIT TESTS] Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
if (failed > 0) process.exit(1);
