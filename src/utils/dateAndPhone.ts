/**
 * Monster Gym Management System — Utilities for Date and Phone Operations
 * Owner: Dastagir Kanth
 */

import type { MembershipStatus } from '../types/gym.ts';

export const BASE_MONTHLY_FEE = 2500;
export const RENEWAL_PERIOD_DAYS = 30;

/**
 * Normalizes a Pakistani phone number into standard international format for WhatsApp.
 * Strips all non-digit characters.
 * Replaces leading '0' with '92' (e.g., '03001234567' -> '923001234567').
 * If starts with 10 digits starting with '3' (e.g., '3001234567'), prepends '92'.
 */
export function normalizePakistaniPhone(phone: string): string {
  if (!phone) return '';
  let clean = phone.replace(/\D/g, '');

  if (clean.startsWith('0092')) {
    clean = '92' + clean.slice(4);
  } else if (clean.startsWith('0')) {
    clean = '92' + clean.slice(1);
  } else if (clean.length === 10 && clean.startsWith('3')) {
    clean = '92' + clean;
  }

  return clean;
}

/**
 * Formats a phone number for attractive, clean display in Pakistani convention: 0300 1234567
 */
export function formatDisplayPhone(phone: string): string {
  const clean = normalizePakistaniPhone(phone);
  if (!clean) return phone;
  
  if (clean.startsWith('92') && clean.length === 12) {
    const local = '0' + clean.slice(2);
    return `${local.slice(0, 4)} ${local.slice(4)}`;
  }

  return phone;
}

/**
 * Validates whether the given string represents a valid Pakistani mobile number.
 * Accepts formats like 03001234567, 0300-1234567, +923001234567, 923001234567.
 */
export function isValidPakistaniPhone(phone: string): boolean {
  const clean = normalizePakistaniPhone(phone);
  // Valid Pakistani mobile numbers in intl format are 12 digits starting with 923
  return /^923\d{9}$/.test(clean);
}

/**
 * Generates the WhatsApp renewal reminder URL with clear spacing and emojis:
 * Target: https://wa.me/[CLEAN_PHONE]?text=[ENCODED_MESSAGE]
 */
export function buildWhatsAppReminderUrl(fullName: string, phone: string, expiryDate: string): string {
  const cleanPhone = normalizePakistaniPhone(phone);
  const formattedExpiry = formatDisplayDate(expiryDate);
  const message = `Assalam-o-Alaikum ${fullName.trim()}! 🏋️‍♂️

This is an official renewal reminder from *MONSTER GYM*.

📅 *Membership Expiry:* ${formattedExpiry} (${expiryDate})
💰 *Monthly Fee:* PKR 2,500

✨ *Important Note:*
Kindly renew your membership by your expiry date to enjoy uninterrupted gym floor, professional equipment, and locker access.

💳 *Accepted Payment Methods:*
• 💵 Cash at Front Desk
• 📱 EasyPaisa
• 📲 JazzCash

If you have already paid or have questions, feel free to reply to this message.

Stay fit, stay strong! 💪🔥

Warm Regards,
*Dastagir Kanth*
Owner & Founder, Monster Gym 👑`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates the WhatsApp welcome URL for newly enrolled members with clear spacing and emojis:
 */
export function buildWhatsAppWelcomeUrl(fullName: string, phone: string, expiryDate: string): string {
  const cleanPhone = normalizePakistaniPhone(phone);
  const formattedExpiry = formatDisplayDate(expiryDate);
  const message = `Assalam-o-Alaikum ${fullName.trim()}! 🏋️‍♂️🎉

Welcome to the *MONSTER GYM* family! Your membership has been successfully registered.

📋 *Membership Pass Details:*
• 👤 *Member Name:* ${fullName.trim()}
• 📅 *Pass Valid Until:* ${formattedExpiry}
• 💰 *Monthly Renewal Fee:* PKR 2,500

✨ *Gym Facilities & Guidelines:*
• 🏋️ Full access to gym floor & heavy workout stations
• 🔒 Safe locker facility available
• ⏱️ Training hours: Monday to Saturday

We are excited to partner with you on your fitness transformation. Let's crush your goals together! 💪🔥

Warm Regards,
*Dastagir Kanth*
Owner & Head Coach, Monster Gym 👑`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Parses a YYYY-MM-DD string into a Date object normalized to local midnight.
 */
export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Formats a Date object to YYYY-MM-DD string using local calendar parts.
 */
export function formatDateIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns today's date formatted as YYYY-MM-DD at local midnight.
 */
export function getTodayIso(): string {
  return formatDateIso(new Date());
}

/**
 * Checks membership status against the strict 48-hour threshold:
 * - EXPIRED: expiry_date < Today (diffDays < 0)
 * - EXPIRING_SOON: Today <= expiry_date <= Today + 2 Days (diffDays >= 0 && diffDays <= 2)
 * - ACTIVE: expiry_date > Today + 2 Days (diffDays > 2)
 */
export function checkMembershipStatus(expiryDateIso: string): {
  status: MembershipStatus;
  daysRemaining: number;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = parseDateString(expiryDateIso);

  // Exact calendar difference in whole days
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { status: 'EXPIRED', daysRemaining: diffDays };
  }
  if (diffDays <= 2) {
    return { status: 'EXPIRING_SOON', daysRemaining: diffDays };
  }
  return { status: 'ACTIVE', daysRemaining: diffDays };
}

/**
 * Computes the new expiry date after renewal following the exact business rules:
 * - Each payment extends expiry by exactly 30 calendar days.
 * - If membership is already expired when renewed, new expiry = Today + 30 calendar days.
 * - If membership is currently active or expiring soon, new expiry = Current Expiry + 30 calendar days.
 */
export function calculateRenewalExpiry(currentExpiryIso: string, renewalDateIso: string = getTodayIso()): string {
  const renewalBaseDate = parseDateString(renewalDateIso);
  const currentExpiry = parseDateString(currentExpiryIso);

  // If already expired relative to renewal date, anchor from renewal date
  const anchorDate = currentExpiry.getTime() < renewalBaseDate.getTime()
    ? new Date(renewalBaseDate)
    : new Date(currentExpiry);

  // Add exactly 30 calendar days
  anchorDate.setDate(anchorDate.getDate() + RENEWAL_PERIOD_DAYS);
  return formatDateIso(anchorDate);
}

/**
 * Computes the first month expiry date from joining date (+ 30 calendar days).
 */
export function calculateInitialExpiry(joiningDateIso: string): string {
  const date = parseDateString(joiningDateIso);
  date.setDate(date.getDate() + RENEWAL_PERIOD_DAYS);
  return formatDateIso(date);
}

/**
 * Formats an ISO date into a human-readable display (e.g., "15 Sep 2026").
 */
export function formatDisplayDate(dateIso: string): string {
  if (!dateIso) return '';
  const date = parseDateString(dateIso);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formats ISO timestamp to human-friendly time and date (e.g. "12 Sep, 04:30 PM").
 */
export function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Human-friendly relative countdown pill text:
 * e.g., "Expires today", "Expires tomorrow", "Expires in 2 days", "Expired 3 days ago".
 */
export function getRelativeCountdownText(expiryDateIso: string): string {
  const { daysRemaining } = checkMembershipStatus(expiryDateIso);

  if (daysRemaining < -1) {
    return `Expired ${Math.abs(daysRemaining)} days ago`;
  }
  if (daysRemaining === -1) {
    return 'Expired yesterday';
  }
  if (daysRemaining === 0) {
    return 'Expires today';
  }
  if (daysRemaining === 1) {
    return 'Expires tomorrow';
  }
  return `Expires in ${daysRemaining} days`;
}

/**
 * Formats a currency amount into PKR display string (e.g., "PKR 2,500").
 */
export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString('en-PK')}`;
}
