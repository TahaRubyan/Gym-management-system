/**
 * Monster Gym — Domain Logic & Business Rules Verification Test Suite
 */

import {
  normalizePakistaniPhone,
  isValidPakistaniPhone,
  buildWhatsAppReminderUrl,
  checkMembershipStatus,
  calculateRenewalExpiry,
  calculateInitialExpiry,
  parseDateString,
  formatDateIso,
  BASE_MONTHLY_FEE,
  RENEWAL_PERIOD_DAYS,
} from '../src/utils/dateAndPhone.ts';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

console.log('=== TEST 1: Pakistani Phone Normalization & Validation ===');
assert(normalizePakistaniPhone('03001234567') === '923001234567', 'Leading 0 is replaced by 92');
assert(normalizePakistaniPhone('0321-9876543') === '923219876543', 'Hyphens stripped and normalized');
assert(normalizePakistaniPhone('+92 333 5551234') === '923335551234', '+ and spaces stripped, 92 preserved');
assert(normalizePakistaniPhone('3012345678') === '923012345678', '10 digits starting with 3 prepends 92');
assert(isValidPakistaniPhone('03001234567'), '03001234567 is valid Pakistani phone');
assert(isValidPakistaniPhone('+923219876543'), '+923219876543 is valid Pakistani phone');
assert(!isValidPakistaniPhone('12345'), 'Too short phone number rejected');
assert(!isValidPakistaniPhone('02134567890'), 'Landline prefix (021) rejected for mobile');

console.log('\n=== TEST 2: WhatsApp Deep-Link Builder & Exact Message Format ===');
const sampleUrl = buildWhatsAppReminderUrl('Hamza Tariq', '03001234567', '2026-09-12');
assert(sampleUrl.startsWith('https://wa.me/923001234567?text='), 'Target URL prefix is correct');
assert(sampleUrl.includes('Assalam-o-Alaikum%20Hamza%20Tariq!%20%F0%9F%8F%8B%EF%B8%8F%E2%80%8D%E2%99%82%EF%B8%8F'), 'Contains greeting and 🏋️‍♂️ emoji');
assert(sampleUrl.includes('PKR%202%2C500'), 'Contains fee PKR 2,500');
assert(sampleUrl.includes('Dastagir%20Kanth'), 'Contains Dastagir Kanth signature');
assert(sampleUrl.includes('%0A%0A'), 'Message contains multiple double-spaced line breaks');

console.log('\n=== TEST 3: Fixed Fee & First Month Calculation ===');
const admissionFee = 1500;
const firstMonthTotal = admissionFee + BASE_MONTHLY_FEE;
assert(BASE_MONTHLY_FEE === 2500, 'Base monthly fee is strictly PKR 2,500');
assert(firstMonthTotal === 4000, 'First month collection is Admission Fee + PKR 2,500');
assert(0 + BASE_MONTHLY_FEE === 2500, 'First month with 0 admission fee is PKR 2,500');

console.log('\n=== TEST 4: 48-Hour Expiring Window Classification ===');
// Today is current date
const todayObj = new Date();
const todayIso = formatDateIso(todayObj);

const tomorrowObj = new Date(todayObj);
tomorrowObj.setDate(tomorrowObj.getDate() + 1);
const tomorrowIso = formatDateIso(tomorrowObj);

const day2Obj = new Date(todayObj);
day2Obj.setDate(day2Obj.getDate() + 2);
const day2Iso = formatDateIso(day2Obj);

const day3Obj = new Date(todayObj);
day3Obj.setDate(day3Obj.getDate() + 3);
const day3Iso = formatDateIso(day3Obj);

const yesterdayObj = new Date(todayObj);
yesterdayObj.setDate(yesterdayObj.getDate() - 1);
const yesterdayIso = formatDateIso(yesterdayObj);

assert(checkMembershipStatus(todayIso).status === 'EXPIRING_SOON', 'Expires today is EXPIRING_SOON');
assert(checkMembershipStatus(tomorrowIso).status === 'EXPIRING_SOON', 'Expires tomorrow is EXPIRING_SOON');
assert(checkMembershipStatus(day2Iso).status === 'EXPIRING_SOON', 'Expires in 2 days is EXPIRING_SOON');
assert(checkMembershipStatus(day3Iso).status === 'ACTIVE', 'Expires in 3 days is ACTIVE');
assert(checkMembershipStatus(yesterdayIso).status === 'EXPIRED', 'Expired yesterday is EXPIRED');

console.log('\n=== TEST 5: Renewal Lifecycle & Boundary Logic ===');
// Active member renewed: new expiry = current expiry + 30 calendar days
const renewalFromActive = calculateRenewalExpiry('2026-10-15', '2026-09-11');
assert(renewalFromActive === '2026-11-14', 'Active renewal adds 30 calendar days to current expiry');

// Expired member renewed: new expiry = Today + 30 calendar days
const renewalFromExpired = calculateRenewalExpiry('2026-08-01', '2026-09-11');
assert(renewalFromExpired === '2026-10-11', 'Expired renewal anchors from today + 30 calendar days');

// Month boundaries across leap year (February in 2028 is a leap year)
const leapYearExpiry = calculateRenewalExpiry('2028-02-15', '2028-02-10');
assert(leapYearExpiry === '2028-03-16', 'Renewal across Feb 29 leap year calculates accurately (+30 days)');

console.log('\n======================================');
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY!');
}
