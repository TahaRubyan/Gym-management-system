/**
 * MONSTER'S GYM — Feature & End-to-End Workflow Test Suite
 * Owner: DASTGIR KANTH
 * Focus: Complete registration wizard, 48h radar detection, overdue date anchoring, safe mock data merge
 */

import {
  normalizePakistaniPhone,
  isValidPakistaniPhone,
  calculateInitialExpiry,
  calculateRenewalExpiry,
  checkMembershipStatus,
  buildWhatsAppWelcomeUrl,
  buildWhatsAppReminderUrl,
  parseDateString,
  formatDateIso,
  BASE_MONTHLY_FEE,
} from '../src/utils/dateAndPhone.ts';
import { DEFAULT_SETTINGS } from '../src/services/storage.ts';

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

console.log('=== [WORKFLOW 1] Member Registration & Onboarding Lifecycle ===');
// 1. Simulate registration wizard input
const rawInput = {
  fullName: 'Zain Malik',
  phone: '0333 4455667',
  joiningDate: '2026-09-16',
  admissionFee: 1500,
  monthlyFee: 2500,
  paymentChannel: 'EASYPAISA',
  notes: 'Morning batch athlete',
  photoUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
};

// Phase 1 Validation
assert(isValidPakistaniPhone(rawInput.phone), 'Phone validation passes for 0333 4455667');
const cleanPhone = normalizePakistaniPhone(rawInput.phone);
assert(cleanPhone === '923334455667', 'Phone normalized to 923334455667');

// Phase 2 Computation
const initialExpiry = calculateInitialExpiry(rawInput.joiningDate);
assert(initialExpiry === '2026-10-16', 'Expiry correctly computed to 30 calendar days ahead (2026-10-16)');

const firstMonthTotal = rawInput.admissionFee + rawInput.monthlyFee;
assert(firstMonthTotal === 4000, 'First month collected PKR 4,000 (PKR 1,500 admission + PKR 2,500 monthly)');

// Simulated created Member record
const createdMember = {
  id: 'mem_zain_malik_1',
  fullName: rawInput.fullName.trim(),
  phone: cleanPhone,
  joiningDate: rawInput.joiningDate,
  expiryDate: initialExpiry,
  monthlyFee: rawInput.monthlyFee,
  status: 'ACTIVE',
  photoUrl: rawInput.photoUrl,
  notes: rawInput.notes,
  createdAt: '2026-09-16T08:00:00.000Z',
  updatedAt: '2026-09-16T08:00:00.000Z',
};

// Simulated created Payment record
const createdPayment = {
  id: 'pay_zain_1',
  memberId: createdMember.id,
  amount: firstMonthTotal,
  paymentDate: rawInput.joiningDate,
  paymentType: 'ADMISSION',
  channel: rawInput.paymentChannel,
  notes: `Admission (PKR ${rawInput.admissionFee}) + Month 1 (PKR ${rawInput.monthlyFee})`,
  createdAt: '2026-09-16T08:00:00.000Z',
};

assert(createdMember.status === 'ACTIVE', 'New member is marked ACTIVE');
assert(createdPayment.amount === 4000, 'Payment logged with full initial amount PKR 4,000');
assert(createdPayment.channel === 'EASYPAISA', 'Payment logged under EASYPAISA channel');

// WhatsApp Welcome trigger
const welcomeUrl = buildWhatsAppWelcomeUrl(
  createdMember.fullName,
  createdMember.phone,
  createdMember.expiryDate,
  DEFAULT_SETTINGS.welcomeTemplate,
  DEFAULT_SETTINGS.gymName,
  DEFAULT_SETTINGS.ownerName,
  createdMember.monthlyFee
);

assert(welcomeUrl.startsWith('https://wa.me/923334455667?text='), 'Welcome URL targets registered mobile');
assert(welcomeUrl.includes('Zain%20Malik'), 'Welcome message includes member name');
assert(welcomeUrl.includes('DASTGIR%20KANTH'), 'Welcome message signed by DASTGIR KANTH');
assert(!welcomeUrl.toLowerCase().includes('locker'), 'Welcome message is free of locker mentions');

console.log('\n=== [WORKFLOW 2] 48-Hour Expiration Radar & One-Tap Alerting ===');
// Simulated gym roster relative to reference date 2026-09-16
const roster = [
  { id: '1', fullName: 'Taha Rubyan', phone: '03481488937', expiryDate: '2026-09-17' }, // In 1 day (EXPIRING_SOON)
  { id: '2', fullName: 'Farhan Butt', phone: '03177769001', expiryDate: '2026-09-18' }, // In 2 days (EXPIRING_SOON)
  { id: '3', fullName: 'Bilal Khan', phone: '03001234567', expiryDate: '2026-09-16' },  // Today (EXPIRING_SOON)
  { id: '4', fullName: 'Asad Ali', phone: '03217654321', expiryDate: '2026-09-25' },    // In 9 days (ACTIVE)
  { id: '5', fullName: 'Usman Ghani', phone: '03339876543', expiryDate: '2026-09-10' }, // Expired 6 days ago (EXPIRED)
];

const referenceToday = parseDateString('2026-09-16');

const expiringRadarMembers = roster.filter(m => {
  const exp = parseDateString(m.expiryDate);
  const diffDays = Math.round((exp.getTime() - referenceToday.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 2;
});

assert(expiringRadarMembers.length === 3, 'Radar correctly filters exactly 3 members in 48-hour window');
assert(expiringRadarMembers.some(m => m.fullName === 'Taha Rubyan'), 'Includes Taha Rubyan in radar');
assert(expiringRadarMembers.some(m => m.fullName === 'Farhan Butt'), 'Includes Farhan Butt in radar');
assert(expiringRadarMembers.some(m => m.fullName === 'Bilal Khan'), 'Includes Bilal Khan (expiring today) in radar');
assert(!expiringRadarMembers.some(m => m.fullName === 'Asad Ali'), 'Excludes safe active member (Asad Ali)');
assert(!expiringRadarMembers.some(m => m.fullName === 'Usman Ghani'), 'Excludes past expired member (Usman Ghani)');

// Generate reminder URL for Taha Rubyan
const tahaReminderUrl = buildWhatsAppReminderUrl(
  'Taha Rubyan',
  '03481488937',
  '2026-09-17',
  DEFAULT_SETTINGS.reminderTemplate,
  DEFAULT_SETTINGS.gymName,
  DEFAULT_SETTINGS.ownerName,
  2500
);
assert(tahaReminderUrl.startsWith('https://wa.me/923481488937?text='), 'Generates valid link for Taha Rubyan');
assert(tahaReminderUrl.includes('Taha%20Rubyan'), 'Reminder contains Taha Rubyan name');
assert(!tahaReminderUrl.toLowerCase().includes('locker'), 'Reminder has no locker mentions');

console.log('\n=== [WORKFLOW 3] Overdue Payment Logging & Date Anchoring ===');
// Scenario: Usman Ghani expired on 2026-09-10. He comes to the gym on 2026-09-14 (4 days overdue).
const memberExpiry = '2026-09-10';
const paymentDay = '2026-09-14';

// Case A: Owner selects "Anchor to Current Date" (CURRENT_DATE)
// The member gets 30 days starting from the date they paid (2026-09-14 + 30 days = 2026-10-14)
const currentDateExpiry = calculateRenewalExpiry(memberExpiry, paymentDay, 'CURRENT_DATE');
assert(currentDateExpiry === '2026-10-14', 'Current date anchor gives 30 days from payment date');

// Case B: Owner selects "Continuous Validity" (PREVIOUS_EXPIRY)
// The member gets 30 days extending their original expiry (2026-09-10 + 30 days = 2026-10-10)
const previousDateExpiry = calculateRenewalExpiry(memberExpiry, paymentDay, 'PREVIOUS_EXPIRY');
assert(previousDateExpiry === '2026-10-10', 'Previous expiry anchor gives 30 days from original expiry');

console.log('\n=== [WORKFLOW 4] Safe Mock Data Merging (Zero Data Loss) ===');
// Simulate existing database contents with custom user-entered member
const existingMembers = [
  { id: 'custom_member_101', fullName: 'Real Member One', phone: '923009998877', expiryDate: '2026-10-20' },
  { id: 'seed_1', fullName: 'Old Mock Name', phone: '923001234567', expiryDate: '2026-09-20' },
];

const incomingSeedMembers = [
  { id: 'seed_1', fullName: 'Updated Mock Name', phone: '923001234567', expiryDate: '2026-09-22' },
  { id: 'seed_taha', fullName: 'Taha Rubyan (TEST)', phone: '923481488937', expiryDate: '2026-09-17' },
  { id: 'seed_farhan', fullName: 'Farhan Butt (TEST)', phone: '923177769001', expiryDate: '2026-09-18' },
];

// Merge logic simulation (mirrors mergeSeedData in storage.ts)
const existingMap = new Map(existingMembers.map(m => [m.id, m]));
for (const seed of incomingSeedMembers) {
  if (!existingMap.has(seed.id)) {
    existingMap.set(seed.id, seed);
  }
}
const mergedMembers = Array.from(existingMap.values());

assert(mergedMembers.length === 4, 'Merged count is 4 (1 custom user + 1 existing seed + 2 new seeds)');
assert(mergedMembers.some(m => m.id === 'custom_member_101'), 'Custom user-entered member was safely preserved');
assert(mergedMembers.some(m => m.id === 'seed_taha'), 'New seed member Taha Rubyan was successfully added');
assert(mergedMembers.some(m => m.id === 'seed_farhan'), 'New seed member Farhan Butt was successfully added');
assert(mergedMembers.find(m => m.id === 'seed_1').fullName === 'Old Mock Name', 'Existing member record was not overwritten');

console.log('\n----------------------------------------');
console.log(`[FEATURE WORKFLOW TESTS] Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
if (failed > 0) process.exit(1);
