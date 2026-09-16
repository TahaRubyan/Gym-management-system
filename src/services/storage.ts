/**
 * MONSTER'S GYM Management System — Persistent Database Layer (Dexie.js / IndexedDB)
 * Owner: DASTGIR KANTH
 * Complete offline-first synchronization, zero lag, and instant reactive updates.
 */

import Dexie, { type EntityTable } from 'dexie';
import type {
  Member,
  Payment,
  ReminderLog,
  NewMemberInput,
  RenewalInput,
  DashboardMetrics,
  PaymentChannel,
  ChannelStat,
  EnrichedPayment,
  GymSettings,
} from '../types/gym.ts';
import {
  BASE_MONTHLY_FEE,
  calculateInitialExpiry,
  calculateRenewalExpiry,
  checkMembershipStatus,
  getTodayIso,
} from '../utils/dateAndPhone.ts';
import { generateInitialSeedData } from './seedData.ts';

export const DEFAULT_SETTINGS: GymSettings = {
  gymName: "MONSTER'S GYM",
  ownerName: 'DASTGIR KANTH',
  securityPin: '1234',
  monthlyFee: 2500,
  defaultAdmissionFee: 1000,
  reminderTemplate: `Assalam-o-Alaikum {name}! 🏋️‍♂️

Reminder from *{gymName}*:
📅 *Expiry:* {expiry}
💰 *Fee:* PKR {fee}

Please renew your monthly pass on time.
• Cash / EasyPaisa / JazzCash

Stay strong! 💪
*{ownerName}*`,
  welcomeTemplate: `Assalam-o-Alaikum {name}! 🏋️‍♂️🎉

Welcome to *{gymName}*! Your pass is active.
📅 *Valid Until:* {expiry}
💰 *Monthly Fee:* PKR {fee}

Training hours: Mon – Sat. Let's crush your goals! 💪🔥

Warm Regards,
*{ownerName}*`,
};

const SETTINGS_STORAGE_KEY = 'monsters_gym_settings_v1';

export function getGymSettings(): GymSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // Ignore error and return defaults
  }
  return DEFAULT_SETTINGS;
}

export function saveGymSettings(settings: GymSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save gym settings:', err);
  }
}

class MonsterGymDatabase extends Dexie {
  members!: EntityTable<Member, 'id'>;
  payments!: EntityTable<Payment, 'id'>;
  reminders!: EntityTable<ReminderLog, 'id'>;

  constructor() {
    super('MonsterGymDB');
    this.version(1).stores({
      members: 'id, full_name, phone, expiry_date, status, joined_date, created_at',
      payments: 'id, member_id, fee_type, channel, paid_at, valid_until',
      reminders: 'id, member_id, sent_at, expiry_date',
    });
  }
}

export const db = new MonsterGymDatabase();

/**
 * Initializes database and seeds sample data if empty.
 * Preserves all user data and ensures priority testing members exist.
 */
export async function initializeDatabase(): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    try {
      await navigator.storage.persist();
    } catch {
      // Best-effort storage persistence
    }
  }

  const memberCount = await db.members.count();
  if (memberCount === 0) {
    const seed = generateInitialSeedData();
    await db.transaction('rw', db.members, db.payments, db.reminders, async () => {
      await db.members.bulkAdd(seed.members);
      await db.payments.bulkAdd(seed.payments);
      await db.reminders.bulkAdd(seed.reminders);
    });
  } else {
    // Ensure test members TAHA RUBYAN & FARHAN BUTT exist even in existing installations
    const tahaExists = await db.members.where('phone').equals('03481488937').first();
    const farhanExists = await db.members.where('phone').equals('03177769001').first();
    if (!tahaExists || !farhanExists) {
      const freshSeed = generateInitialSeedData();
      const testMembers = freshSeed.members.filter(m => m.id === 'mem-taha' || m.id === 'mem-farhan');
      const testPayments = freshSeed.payments.filter(p => p.id === 'pay-taha' || p.id === 'pay-farhan');
      await db.transaction('rw', db.members, db.payments, async () => {
        for (const tm of testMembers) {
          await db.members.put(tm);
        }
        for (const tp of testPayments) {
          await db.payments.put(tp);
        }
      });
    }

    // Re-verify statuses for all members relative to current date
    const allMembers = await db.members.toArray();
    const updates: Member[] = [];
    for (const member of allMembers) {
      const { status } = checkMembershipStatus(member.expiry_date);
      if (status !== member.status) {
        updates.push({ ...member, status });
      }
    }
    if (updates.length > 0) {
      await db.members.bulkPut(updates);
    }
  }
}

/**
 * Merges initial seed data into the existing database without removing user-entered members.
 */
export async function mergeSeedData(): Promise<number> {
  const seed = generateInitialSeedData();
  let mergedCount = 0;
  await db.transaction('rw', db.members, db.payments, db.reminders, async () => {
    for (const member of seed.members) {
      const existing = await db.members.where('phone').equals(member.phone).first();
      if (!existing) {
        await db.members.put(member);
        mergedCount++;
      }
    }
    for (const payment of seed.payments) {
      const exists = await db.payments.get(payment.id);
      if (!exists) {
        await db.payments.put(payment);
      }
    }
  });
  return mergedCount;
}

/**
 * Restores demo database with option to preserve or overwrite.
 * Default keeps user-created custom members intact.
 */
export async function resetDatabaseToSeed(preserveCustom: boolean = true): Promise<void> {
  if (!preserveCustom) {
    await db.transaction('rw', db.members, db.payments, db.reminders, async () => {
      await db.members.clear();
      await db.payments.clear();
      await db.reminders.clear();

      const seed = generateInitialSeedData();
      await db.members.bulkAdd(seed.members);
      await db.payments.bulkAdd(seed.payments);
      await db.reminders.bulkAdd(seed.reminders);
    });
  } else {
    // Preserve custom members and merge demo data
    await mergeSeedData();
  }
}

/**
 * Atomic Registration:
 * 1. Creates Member record with optional photo_url.
 * 2. Calculates Month 1 Total = Admission Fee (>= 0) + Monthly Fee.
 * 3. Sets expiry_date = Joined Date + 30 calendar days.
 * 4. Inserts FIRST_MONTH_PACKAGE payment record.
 */
export async function registerMemberWithPayment(input: NewMemberInput): Promise<Member> {
  const settings = getGymSettings();
  const monthlyFee = settings.monthlyFee || BASE_MONTHLY_FEE;
  const admissionFee = Math.max(0, Number(input.admission_fee) || 0);
  const totalAmount = admissionFee + monthlyFee;
  const expiryDate = calculateInitialExpiry(input.joined_date);
  const { status } = checkMembershipStatus(expiryDate);
  const nowIso = new Date().toISOString();

  const memberId = 'mem-' + crypto.randomUUID().slice(0, 8);
  const paymentId = 'pay-' + crypto.randomUUID().slice(0, 8);

  const newMember: Member = {
    id: memberId,
    full_name: input.full_name.trim(),
    phone: input.phone.trim(),
    joined_date: input.joined_date,
    admission_fee: admissionFee,
    monthly_fee: monthlyFee,
    expiry_date: expiryDate,
    status,
    notes: input.notes?.trim() || undefined,
    photo_url: input.photo_url || undefined,
    created_at: nowIso,
  };

  const initialPayment: Payment = {
    id: paymentId,
    member_id: memberId,
    amount: totalAmount,
    fee_type: 'FIRST_MONTH_PACKAGE',
    channel: input.channel,
    transaction_ref: input.transaction_ref?.trim() || undefined,
    paid_at: nowIso,
    valid_until: expiryDate,
  };

  await db.transaction('rw', db.members, db.payments, async () => {
    await db.members.add(newMember);
    await db.payments.add(initialPayment);
  });

  return newMember;
}

/**
 * Atomic Renewal:
 * 1. Extends membership by strictly 30 calendar days.
 *    - If already expired, anchorMode controls whether renewal anchors to payment date ('CURRENT_DATE')
 *      or extends from original expiry ('PREVIOUS_EXPIRY').
 *    - If active/expiring, new expiry = Current Expiry + 30 days.
 * 2. Inserts MONTHLY_RENEWAL payment record.
 * 3. Updates member's expiry_date and recomputed status.
 */
export async function renewMembership(input: RenewalInput): Promise<{ member: Member; payment: Payment }> {
  const member = await db.members.get(input.member_id);
  if (!member) {
    throw new Error(`Member with ID ${input.member_id} not found.`);
  }

  const settings = getGymSettings();
  const renewalAmount = input.amount || settings.monthlyFee || BASE_MONTHLY_FEE;
  const todayIso = getTodayIso();
  const renewalDateIso = input.paid_at || todayIso;
  const anchorMode = input.anchorMode || 'CURRENT_DATE';
  const newExpiryDate = calculateRenewalExpiry(member.expiry_date, renewalDateIso, anchorMode);
  const { status: newStatus } = checkMembershipStatus(newExpiryDate);
  const nowIso = new Date().toISOString();

  const paymentId = 'pay-' + crypto.randomUUID().slice(0, 8);

  const payment: Payment = {
    id: paymentId,
    member_id: member.id,
    amount: renewalAmount,
    fee_type: 'MONTHLY_RENEWAL',
    channel: input.channel,
    transaction_ref: input.transaction_ref?.trim() || undefined,
    paid_at: nowIso,
    valid_until: newExpiryDate,
  };

  const updatedMember: Member = {
    ...member,
    expiry_date: newExpiryDate,
    status: newStatus,
  };

  await db.transaction('rw', db.members, db.payments, async () => {
    await db.members.put(updatedMember);
    await db.payments.add(payment);
  });

  return { member: updatedMember, payment };
}

/**
 * Updates member contact details, photo, or notes.
 */
export async function updateMember(
  id: string,
  updates: Partial<Pick<Member, 'full_name' | 'phone' | 'notes' | 'photo_url'>>
): Promise<Member> {
  const member = await db.members.get(id);
  if (!member) {
    throw new Error(`Member ${id} not found`);
  }

  const updated: Member = {
    ...member,
    ...updates,
  };

  await db.members.put(updated);
  return updated;
}

/**
 * Cascade deletes a member, their payments, and reminder records.
 */
export async function deleteMember(id: string): Promise<void> {
  await db.transaction('rw', db.members, db.payments, db.reminders, async () => {
    await db.payments.where('member_id').equals(id).delete();
    await db.reminders.where('member_id').equals(id).delete();
    await db.members.delete(id);
  });
}

/**
 * Records that a WhatsApp reminder was dispatched for this member & expiry date.
 */
export async function logWhatsAppReminder(memberId: string, expiryDate: string): Promise<void> {
  const reminderId = 'rem-' + crypto.randomUUID().slice(0, 8);
  await db.reminders.add({
    id: reminderId,
    member_id: memberId,
    sent_at: new Date().toISOString(),
    expiry_date: expiryDate,
  });
}

/**
 * Checks if a reminder was already sent for the member's current expiry date.
 */
export async function isReminderSentForCurrentExpiry(memberId: string, expiryDate: string): Promise<boolean> {
  const count = await db.reminders
    .where('member_id')
    .equals(memberId)
    .filter((r) => r.expiry_date === expiryDate)
    .count();
  return count > 0;
}

/**
 * Computes live dashboard metrics including monthly revenues, channel distributions,
 * member statuses, and recent enriched payment activities.
 */
export async function calculateDashboardMetrics(): Promise<DashboardMetrics> {
  const members = await db.members.toArray();
  const payments = await db.payments.toArray();

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  let totalMonthlyRevenue = 0;
  let admissionRevenue = 0;
  let renewalRevenue = 0;

  const channelMap: Record<PaymentChannel, { amount: number; count: number; label: string }> = {
    CASH: { amount: 0, count: 0, label: 'Cash' },
    EASYPAISA: { amount: 0, count: 0, label: 'EasyPaisa' },
    JAZZCASH: { amount: 0, count: 0, label: 'JazzCash' },
    BANK_TRANSFER: { amount: 0, count: 0, label: 'Bank / Raast' },
  };

  // Process payments
  for (const payment of payments) {
    const payDate = new Date(payment.paid_at);
    const isCurrentMonth = payDate.getMonth() === currentMonth && payDate.getFullYear() === currentYear;

    if (isCurrentMonth) {
      totalMonthlyRevenue += payment.amount;

      if (payment.fee_type === 'FIRST_MONTH_PACKAGE') {
        const admissionPart = Math.max(0, payment.amount - BASE_MONTHLY_FEE);
        const monthlyPart = Math.min(payment.amount, BASE_MONTHLY_FEE);
        admissionRevenue += admissionPart;
        renewalRevenue += monthlyPart;
      } else {
        renewalRevenue += payment.amount;
      }
    }

    // Channel totals
    if (channelMap[payment.channel]) {
      channelMap[payment.channel].amount += payment.amount;
      channelMap[payment.channel].count += 1;
    }
  }

  // Member status distribution
  let activeMembersCount = 0;
  let expiringMembersCount = 0;
  let expiredMembersCount = 0;

  for (const member of members) {
    const { status } = checkMembershipStatus(member.expiry_date);
    if (status === 'ACTIVE') activeMembersCount++;
    else if (status === 'EXPIRING_SOON') expiringMembersCount++;
    else if (status === 'EXPIRED') expiredMembersCount++;
  }

  // Channel breakdown percentage
  const totalAllTimeRevenue = Object.values(channelMap).reduce((sum, c) => sum + c.amount, 0);
  const channelStats: ChannelStat[] = (Object.keys(channelMap) as PaymentChannel[]).map((ch) => {
    const data = channelMap[ch];
    return {
      channel: ch,
      label: data.label,
      amount: data.amount,
      count: data.count,
      percentage: totalAllTimeRevenue > 0 ? Math.round((data.amount / totalAllTimeRevenue) * 100) : 0,
    };
  });

  // Recent payments enriched with member info
  const memberMap = new Map(members.map((m) => [m.id, m]));
  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime()
  );

  const recentPayments: EnrichedPayment[] = sortedPayments.slice(0, 8).map((p) => {
    const mem = memberMap.get(p.member_id);
    return {
      ...p,
      member_name: mem ? mem.full_name : 'Unknown Member',
      member_phone: mem ? mem.phone : '',
    };
  });

  return {
    totalMonthlyRevenue,
    admissionRevenue,
    renewalRevenue,
    activeMembersCount,
    expiringMembersCount,
    expiredMembersCount,
    totalMembersCount: members.length,
    channelStats,
    recentPayments,
  };
}
