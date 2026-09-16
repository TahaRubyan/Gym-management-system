/**
 * MONSTER'S GYM Management System — Core Domain Types
 * Owner: DASTGIR KANTH
 */

export type MembershipStatus = 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED';

export type MembershipFilter = 'ALL' | 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED';

export type PaymentChannel = 'CASH' | 'EASYPAISA' | 'JAZZCASH' | 'BANK_TRANSFER';

export type FeeType = 'FIRST_MONTH_PACKAGE' | 'MONTHLY_RENEWAL';

export interface Member {
  id: string;
  full_name: string;
  phone: string;
  joined_date: string; // YYYY-MM-DD
  admission_fee: number; // Variable, default 0
  monthly_fee: number; // Strictly fixed at PKR 2500
  expiry_date: string; // YYYY-MM-DD
  status: MembershipStatus;
  notes?: string;
  photo_url?: string; // Base64 data URL of live photo
  created_at: string; // ISO 8601 string
}

export interface Payment {
  id: string;
  member_id: string;
  amount: number;
  fee_type: FeeType;
  channel: PaymentChannel;
  transaction_ref?: string;
  paid_at: string; // ISO 8601 string
  valid_until: string; // YYYY-MM-DD
}

export interface ReminderLog {
  id: string;
  member_id: string;
  sent_at: string; // ISO 8601 string
  expiry_date: string; // YYYY-MM-DD
}

export interface ChannelStat {
  channel: PaymentChannel;
  label: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface EnrichedPayment extends Payment {
  member_name: string;
  member_phone: string;
}

export interface DashboardMetrics {
  totalMonthlyRevenue: number;
  admissionRevenue: number;
  renewalRevenue: number;
  activeMembersCount: number;
  expiringMembersCount: number;
  expiredMembersCount: number;
  totalMembersCount: number;
  channelStats: ChannelStat[];
  recentPayments: EnrichedPayment[];
}

export interface NewMemberInput {
  full_name: string;
  phone: string;
  joined_date: string;
  admission_fee: number;
  channel: PaymentChannel;
  transaction_ref?: string;
  notes?: string;
  photo_url?: string;
}

export type ExpiryAnchorMode = 'CURRENT_DATE' | 'PREVIOUS_EXPIRY';

export interface RenewalInput {
  member_id: string;
  amount?: number; // Strictly defaults to 2500
  channel: PaymentChannel;
  transaction_ref?: string;
  paid_at?: string;
  anchorMode?: ExpiryAnchorMode;
}

export interface GymSettings {
  gymName: string;
  ownerName: string;
  securityPin: string; // 4 digits
  monthlyFee: number;
  defaultAdmissionFee: number;
  reminderTemplate: string;
  welcomeTemplate: string;
}
