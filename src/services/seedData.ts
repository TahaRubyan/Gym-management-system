/**
 * Monster Gym Management System — Initial Seed Data
 * Tailored for Dastagir Kanth (Monster Gym)
 * Relative dates generated to ensure instant demonstration of 48h expiring alerts,
 * active members, expired members, and multi-channel revenue breakdown.
 */

import { Member, Payment, ReminderLog } from '../types/gym';
import { formatDateIso, getTodayIso } from '../utils/dateAndPhone';

function createDateWithOffset(daysOffset: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + daysOffset);
  return formatDateIso(date);
}

export function generateInitialSeedData(): {
  members: Member[];
  payments: Payment[];
  reminders: ReminderLog[];
} {
  const today = getTodayIso();
  const nowIso = new Date().toISOString();

  const members: Member[] = [
    // 48-Hour Expiring Window (Priority Testing Members)
    {
      id: 'mem-taha',
      full_name: 'TAHA RUBYAN',
      phone: '03481488937',
      joined_date: createDateWithOffset(-30),
      admission_fee: 1500,
      monthly_fee: 2500,
      expiry_date: today, // Expires TODAY
      status: 'EXPIRING_SOON',
      notes: 'Priority Test Member • Direct WhatsApp Verification',
      created_at: createDateWithOffset(-30) + 'T09:00:00.000Z',
    },
    {
      id: 'mem-farhan',
      full_name: 'Farhan Butt',
      phone: '03177769001',
      joined_date: createDateWithOffset(-29),
      admission_fee: 1000,
      monthly_fee: 2500,
      expiry_date: createDateWithOffset(1), // Expires Tomorrow
      status: 'EXPIRING_SOON',
      notes: 'Priority Test Member • 48h Urgency Testing',
      created_at: createDateWithOffset(-29) + 'T09:30:00.000Z',
    },
    {
      id: 'mem-001',
      full_name: 'Bilal Ahmed',
      phone: '03219876543',
      joined_date: createDateWithOffset(-30),
      admission_fee: 1000,
      monthly_fee: 2500,
      expiry_date: today, // Expires TODAY
      status: 'EXPIRING_SOON',
      notes: 'Morning heavy lifting group • Locker #08',
      created_at: createDateWithOffset(-30) + 'T08:00:00.000Z',
    },
    {
      id: 'mem-002',
      full_name: 'Hamza Tariq',
      phone: '03014567890',
      joined_date: createDateWithOffset(-29),
      admission_fee: 1500,
      monthly_fee: 2500,
      expiry_date: createDateWithOffset(1), // Expires Tomorrow
      status: 'EXPIRING_SOON',
      notes: 'Locker #14 • Evening workout regular',
      created_at: createDateWithOffset(-29) + 'T10:30:00.000Z',
    },
    {
      id: 'mem-003',
      full_name: 'Danial Malik',
      phone: '03028899001',
      joined_date: createDateWithOffset(-29),
      admission_fee: 1000,
      monthly_fee: 2500,
      expiry_date: createDateWithOffset(1), // Expires Tomorrow
      status: 'EXPIRING_SOON',
      notes: 'Cardio & Crossfit trainee',
      created_at: createDateWithOffset(-29) + 'T11:15:00.000Z',
    },
    {
      id: 'mem-004',
      full_name: 'Usman Ali Khan',
      phone: '03335551234',
      joined_date: createDateWithOffset(-28),
      admission_fee: 2000,
      monthly_fee: 2500,
      expiry_date: createDateWithOffset(2), // Expires in 2 days
      status: 'EXPIRING_SOON',
      notes: 'Personal training focus on bench press',
      created_at: createDateWithOffset(-28) + 'T14:15:00.000Z',
    },

    // Active Members
    {
      id: 'mem-005',
      full_name: 'Zubair Shah',
      phone: '03456789012',
      joined_date: createDateWithOffset(-50),
      admission_fee: 1500,
      monthly_fee: 2500,
      expiry_date: createDateWithOffset(10), // Active (10 days left)
      status: 'ACTIVE',
      notes: 'Locker #05 • Renewed via JazzCash',
      created_at: createDateWithOffset(-50) + 'T11:00:00.000Z',
    },
    {
      id: 'mem-006',
      full_name: 'Farhan Qureshi',
      phone: '03123456789',
      joined_date: createDateWithOffset(-15),
      admission_fee: 2500,
      monthly_fee: 2500,
      expiry_date: createDateWithOffset(15), // Active (15 days left)
      status: 'ACTIVE',
      notes: 'VIP student package • Locker #21',
      created_at: createDateWithOffset(-15) + 'T17:45:00.000Z',
    },
    {
      id: 'mem-007',
      full_name: 'Shahid Mehmood',
      phone: '03001122334',
      joined_date: createDateWithOffset(-5),
      admission_fee: 0,
      monthly_fee: 2500,
      expiry_date: createDateWithOffset(25), // Active (25 days left)
      status: 'ACTIVE',
      notes: 'Referred by Hamza Tariq',
      created_at: createDateWithOffset(-5) + 'T19:20:00.000Z',
    },
    {
      id: 'mem-008',
      full_name: 'Ali Raza',
      phone: '03341234567',
      joined_date: createDateWithOffset(-8),
      admission_fee: 1500,
      monthly_fee: 2500,
      expiry_date: createDateWithOffset(22), // Active (22 days left)
      status: 'ACTIVE',
      notes: 'Late evening powerlifting',
      created_at: createDateWithOffset(-8) + 'T20:00:00.000Z',
    },
    {
      id: 'mem-009',
      full_name: 'Zain Ul Abideen',
      phone: '03239988776',
      joined_date: createDateWithOffset(-14),
      admission_fee: 1000,
      monthly_fee: 2500,
      expiry_date: createDateWithOffset(16), // Active (16 days left)
      status: 'ACTIVE',
      notes: 'Locker #19 • EasyPaisa regular',
      created_at: createDateWithOffset(-14) + 'T16:30:00.000Z',
    },
    {
      id: 'mem-010',
      full_name: 'Hassan Sheikh',
      phone: '03045566778',
      joined_date: createDateWithOffset(-2),
      admission_fee: 2000,
      monthly_fee: 2500,
      expiry_date: createDateWithOffset(28), // Active (28 days left)
      status: 'ACTIVE',
      notes: 'New registration • Raast Bank IBFT',
      created_at: createDateWithOffset(-2) + 'T18:10:00.000Z',
    },
    {
      id: 'mem-011',
      full_name: 'Omer Farooq',
      phone: '03134455667',
      joined_date: createDateWithOffset(-23),
      admission_fee: 1000,
      monthly_fee: 2500,
      expiry_date: createDateWithOffset(7), // Active (7 days left)
      status: 'ACTIVE',
      notes: 'Morning shift • Locker #03',
      created_at: createDateWithOffset(-23) + 'T07:30:00.000Z',
    },

    // Expired / Overdue Members
    {
      id: 'mem-012',
      full_name: 'Kamran Butt',
      phone: '03224466880',
      joined_date: createDateWithOffset(-45),
      admission_fee: 1500,
      monthly_fee: 2500,
      expiry_date: createDateWithOffset(-4), // Expired 4 days ago
      status: 'EXPIRED',
      notes: 'Needs follow up call on WhatsApp',
      created_at: createDateWithOffset(-45) + 'T09:00:00.000Z',
    },
    {
      id: 'mem-013',
      full_name: 'Asim Riaz',
      phone: '03157788991',
      joined_date: createDateWithOffset(-60),
      admission_fee: 1000,
      monthly_fee: 2500,
      expiry_date: createDateWithOffset(-9), // Expired 9 days ago
      status: 'EXPIRED',
      notes: 'Exam week leave • promised to renew',
      created_at: createDateWithOffset(-60) + 'T16:00:00.000Z',
    },
    {
      id: 'mem-014',
      full_name: 'Waqas Gondal',
      phone: '03312233445',
      joined_date: createDateWithOffset(-55),
      admission_fee: 1500,
      monthly_fee: 2500,
      expiry_date: createDateWithOffset(-15), // Expired 15 days ago
      status: 'EXPIRED',
      notes: 'Locker key pending return',
      created_at: createDateWithOffset(-55) + 'T15:20:00.000Z',
    },
  ];

  const payments: Payment[] = [
    {
      id: 'pay-taha',
      member_id: 'mem-taha',
      amount: 4000, // 1500 Admission + 2500 First Month
      fee_type: 'FIRST_MONTH_PACKAGE',
      channel: 'JAZZCASH',
      transaction_ref: 'JC-77890123',
      paid_at: createDateWithOffset(-30) + 'T09:05:00.000Z',
      valid_until: today,
    },
    {
      id: 'pay-farhan',
      member_id: 'mem-farhan',
      amount: 3500, // 1000 Admission + 2500 First Month
      fee_type: 'FIRST_MONTH_PACKAGE',
      channel: 'EASYPAISA',
      transaction_ref: 'EP-55410982',
      paid_at: createDateWithOffset(-29) + 'T09:35:00.000Z',
      valid_until: createDateWithOffset(1),
    },
    {
      id: 'pay-001',
      member_id: 'mem-001',
      amount: 3500, // 1000 Admission + 2500 First Month
      fee_type: 'FIRST_MONTH_PACKAGE',
      channel: 'EASYPAISA',
      transaction_ref: 'EP-98234710',
      paid_at: createDateWithOffset(-30) + 'T08:05:00.000Z',
      valid_until: today,
    },
    {
      id: 'pay-002',
      member_id: 'mem-002',
      amount: 4000, // 1500 Admission + 2500 First Month
      fee_type: 'FIRST_MONTH_PACKAGE',
      channel: 'CASH',
      transaction_ref: 'CASH-REC-101',
      paid_at: createDateWithOffset(-29) + 'T10:35:00.000Z',
      valid_until: createDateWithOffset(1),
    },
    {
      id: 'pay-003',
      member_id: 'mem-003',
      amount: 3500, // 1000 Admission + 2500 First Month
      fee_type: 'FIRST_MONTH_PACKAGE',
      channel: 'JAZZCASH',
      transaction_ref: 'JC-44910238',
      paid_at: createDateWithOffset(-29) + 'T11:20:00.000Z',
      valid_until: createDateWithOffset(1),
    },
    {
      id: 'pay-004',
      member_id: 'mem-004',
      amount: 4500, // 2000 Admission + 2500 First Month
      fee_type: 'FIRST_MONTH_PACKAGE',
      channel: 'JAZZCASH',
      transaction_ref: 'JC-87123984',
      paid_at: createDateWithOffset(-28) + 'T14:20:00.000Z',
      valid_until: createDateWithOffset(2),
    },
    {
      id: 'pay-005',
      member_id: 'mem-005',
      amount: 4000, // First Month
      fee_type: 'FIRST_MONTH_PACKAGE',
      channel: 'CASH',
      transaction_ref: 'CASH-REC-082',
      paid_at: createDateWithOffset(-50) + 'T11:05:00.000Z',
      valid_until: createDateWithOffset(-20),
    },
    {
      id: 'pay-006',
      member_id: 'mem-005',
      amount: 2500, // Renewal
      fee_type: 'MONTHLY_RENEWAL',
      channel: 'JAZZCASH',
      transaction_ref: 'JC-90182374',
      paid_at: createDateWithOffset(-20) + 'T12:00:00.000Z',
      valid_until: createDateWithOffset(10),
    },
    {
      id: 'pay-007',
      member_id: 'mem-006',
      amount: 5000, // 2500 Admission + 2500 First Month
      fee_type: 'FIRST_MONTH_PACKAGE',
      channel: 'BANK_TRANSFER',
      transaction_ref: 'RAAST-54219803',
      paid_at: createDateWithOffset(-15) + 'T17:50:00.000Z',
      valid_until: createDateWithOffset(15),
    },
    {
      id: 'pay-008',
      member_id: 'mem-007',
      amount: 2500, // 0 Admission + 2500 First Month
      fee_type: 'FIRST_MONTH_PACKAGE',
      channel: 'CASH',
      transaction_ref: 'CASH-REC-109',
      paid_at: createDateWithOffset(-5) + 'T19:25:00.000Z',
      valid_until: createDateWithOffset(25),
    },
    {
      id: 'pay-009',
      member_id: 'mem-008',
      amount: 4000, // 1500 Admission + 2500 First Month
      fee_type: 'FIRST_MONTH_PACKAGE',
      channel: 'CASH',
      transaction_ref: 'CASH-REC-115',
      paid_at: createDateWithOffset(-8) + 'T20:05:00.000Z',
      valid_until: createDateWithOffset(22),
    },
    {
      id: 'pay-010',
      member_id: 'mem-009',
      amount: 3500, // 1000 Admission + 2500 First Month
      fee_type: 'FIRST_MONTH_PACKAGE',
      channel: 'EASYPAISA',
      transaction_ref: 'EP-11029384',
      paid_at: createDateWithOffset(-14) + 'T16:35:00.000Z',
      valid_until: createDateWithOffset(16),
    },
    {
      id: 'pay-011',
      member_id: 'mem-010',
      amount: 4500, // 2000 Admission + 2500 First Month
      fee_type: 'FIRST_MONTH_PACKAGE',
      channel: 'BANK_TRANSFER',
      transaction_ref: 'MEZAN-9832104',
      paid_at: createDateWithOffset(-2) + 'T18:15:00.000Z',
      valid_until: createDateWithOffset(28),
    },
    {
      id: 'pay-012',
      member_id: 'mem-011',
      amount: 3500, // 1000 Admission + 2500 First Month
      fee_type: 'FIRST_MONTH_PACKAGE',
      channel: 'CASH',
      transaction_ref: 'CASH-REC-105',
      paid_at: createDateWithOffset(-23) + 'T07:35:00.000Z',
      valid_until: createDateWithOffset(7),
    },
  ];

  const reminders: ReminderLog[] = [
    {
      id: 'rem-001',
      member_id: 'mem-001',
      sent_at: nowIso,
      expiry_date: today,
    },
  ];

  return { members, payments, reminders };
}
