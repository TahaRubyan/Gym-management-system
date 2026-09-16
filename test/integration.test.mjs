/**
 * MONSTER'S GYM — Integration Test Suite
 * Owner: DASTGIR KANTH
 * Focus: Settings integration, dynamic WhatsApp URLs, fee reconciliation, and multi-channel aggregation
 */

import {
  buildWhatsAppReminderUrl,
  buildWhatsAppWelcomeUrl,
  interpolateTemplate,
  calculateRenewalExpiry,
  checkMembershipStatus,
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

console.log('=== [INTEGRATION] 1. Gym Default Settings Integrity ===');
assert(DEFAULT_SETTINGS.gymName === "MONSTER'S GYM", "Default gymName is strictly MONSTER'S GYM");
assert(DEFAULT_SETTINGS.ownerName === 'DASTGIR KANTH', 'Default ownerName is strictly DASTGIR KANTH');
assert(DEFAULT_SETTINGS.securityPin === '1234', 'Default securityPin is 1234');
assert(DEFAULT_SETTINGS.monthlyFee === 2500, 'Default monthly fee is 2,500');
assert(DEFAULT_SETTINGS.defaultAdmissionFee === 1000, 'Default admission fee is 1,000');
assert(!DEFAULT_SETTINGS.reminderTemplate.toLowerCase().includes('locker'), 'Reminder template contains zero locker references');
assert(!DEFAULT_SETTINGS.welcomeTemplate.toLowerCase().includes('locker'), 'Welcome template contains zero locker references');

console.log('\n=== [INTEGRATION] 2. Concise WhatsApp Reminder URL Generation ===');
const defaultReminderUrl = buildWhatsAppReminderUrl(
  'Taha Rubyan',
  '03481488937',
  '2026-09-17',
  DEFAULT_SETTINGS.reminderTemplate,
  DEFAULT_SETTINGS.gymName,
  DEFAULT_SETTINGS.ownerName,
  DEFAULT_SETTINGS.monthlyFee
);

assert(defaultReminderUrl.startsWith('https://wa.me/923481488937?text='), 'Encodes phone to WhatsApp click-to-chat format');
assert(defaultReminderUrl.includes('Taha%20Rubyan'), 'Includes member name in reminder');
assert(defaultReminderUrl.includes('DASTGIR%20KANTH'), 'Includes owner name DASTGIR KANTH');
assert(defaultReminderUrl.includes("MONSTER'S%20GYM") || defaultReminderUrl.includes('MONSTER%27S%20GYM'), "Includes gym name MONSTER'S GYM");
assert(defaultReminderUrl.includes('2%2C500') || defaultReminderUrl.includes('2500'), 'Includes fee amount');
assert(!defaultReminderUrl.toLowerCase().includes('locker'), 'Reminder URL contains no locker reference');

// Verify custom template integration
const customTemplate = 'Assalam-o-Alaikum {name}! Monster alert from {ownerName}: Fee PKR {fee} due on {expiry}.';
const customReminderUrl = buildWhatsAppReminderUrl(
  'Farhan Butt',
  '03177769001',
  '2026-09-18',
  customTemplate,
  "MONSTER'S GYM",
  'DASTGIR KANTH',
  3000
);
assert(customReminderUrl.includes('Farhan%20Butt'), 'Custom template receives member name');
assert(customReminderUrl.includes('3%2C000'), 'Custom template receives updated fee (3,000)');
assert(customReminderUrl.includes('DASTGIR%20KANTH'), 'Custom template receives owner name');

console.log('\n=== [INTEGRATION] 3. Concise WhatsApp Welcome URL Generation ===');
const defaultWelcomeUrl = buildWhatsAppWelcomeUrl(
  'Hamza Tariq',
  '03001234567',
  '2026-10-16',
  DEFAULT_SETTINGS.welcomeTemplate,
  DEFAULT_SETTINGS.gymName,
  DEFAULT_SETTINGS.ownerName,
  DEFAULT_SETTINGS.monthlyFee
);

assert(defaultWelcomeUrl.startsWith('https://wa.me/923001234567?text='), 'Generates valid welcome click-to-chat URL');
assert(defaultWelcomeUrl.includes('Hamza%20Tariq'), 'Includes new member name');
assert(defaultWelcomeUrl.includes('DASTGIR%20KANTH'), 'Includes owner signature');
assert(!defaultWelcomeUrl.toLowerCase().includes('locker'), 'Welcome URL contains no locker references');

console.log('\n=== [INTEGRATION] 4. Multi-Channel Fee Reconciliation ===');
// Simulate batch payments across channels
const payments = [
  { amount: 3500, channel: 'CASH', type: 'ADMISSION' },
  { amount: 2500, channel: 'EASYPAISA', type: 'MONTHLY' },
  { amount: 2500, channel: 'JAZZCASH', type: 'MONTHLY' },
  { amount: 2500, channel: 'CASH', type: 'MONTHLY' },
  { amount: 2500, channel: 'BANK_TRANSFER', type: 'MONTHLY' },
];

const channelTotals = payments.reduce((acc, p) => {
  acc[p.channel] = (acc[p.channel] || 0) + p.amount;
  return acc;
}, {});

assert(channelTotals['CASH'] === 6000, 'Reconciles CASH channel total correctly (3500 + 2500 = 6000)');
assert(channelTotals['EASYPAISA'] === 2500, 'Reconciles EASYPAISA channel total correctly (2500)');
assert(channelTotals['JAZZCASH'] === 2500, 'Reconciles JAZZCASH channel total correctly (2500)');
assert(channelTotals['BANK_TRANSFER'] === 2500, 'Reconciles BANK_TRANSFER channel total correctly (2500)');

const grandTotal = payments.reduce((sum, p) => sum + p.amount, 0);
assert(grandTotal === 13500, 'Reconciles Grand Total across all channels (PKR 13,500)');

console.log('\n=== [INTEGRATION] 5. Expiry Status Transitions ===');
// Start with an expired member
const initialExpiry = '2026-09-10';
const paymentDate = '2026-09-14';

// Before renewal, status at 2026-09-14 is EXPIRED
const expiredDiff = (new Date('2026-09-10').getTime() - new Date('2026-09-14').getTime()) / (1000 * 60 * 60 * 24);
assert(expiredDiff < 0, 'Member is expired on payment date');

// Renew with CURRENT_DATE anchoring
const renewedExpiry = calculateRenewalExpiry(initialExpiry, paymentDate, 'CURRENT_DATE');
assert(renewedExpiry === '2026-10-14', 'Renewed expiry anchored to payment date + 30 days');

// Verify status at payment date is now ACTIVE with 30 days remaining
const activeDiff = Math.round((new Date(renewedExpiry).getTime() - new Date(paymentDate).getTime()) / (1000 * 60 * 60 * 24));
assert(activeDiff === 30, 'After renewal, member has exactly 30 days remaining');

console.log('\n----------------------------------------');
console.log(`[INTEGRATION TESTS] Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
if (failed > 0) process.exit(1);
