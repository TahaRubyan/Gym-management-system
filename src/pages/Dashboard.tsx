import React from 'react';
import { motion } from 'motion/react';
import {
  CreditCard,
  UserPlus,
  Receipt,
  ArrowRight,
} from 'lucide-react';
import { DashboardMetrics } from '../types/gym';
import { formatDateTime, formatPKR } from '../utils/dateAndPhone';
import { NavTab } from '../components/BottomNav';
import { RevenueConsole } from '../components/RevenueConsole';

interface DashboardProps {
  metrics: DashboardMetrics | null;
  onNavigate: (tab: NavTab) => void;
  onOpenLogFee: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  metrics,
  onNavigate,
  onOpenLogFee,
}) => {
  if (!metrics) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A3EEA]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-28 px-4 pt-2 max-w-md mx-auto select-none">
      {/* Top Header Headline from Reference Image */}
      <div className="pt-1 flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-normal leading-tight">
            You are on Top
          </h2>
          <p className="text-base sm:text-lg font-medium text-[#64748B] tracking-wide">
            of your Gym Finances
          </p>
        </div>
        <div className="text-right pt-1">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">ROSTER</span>
          <span className="text-xs font-bold text-[#1A3EEA] bg-[#EBF1FF] px-2.5 py-1 rounded-full tracking-wide">
            {metrics.activeMembersCount}/{metrics.totalMembersCount} Active
          </span>
        </div>
      </div>

      {/* Main Revenue Telemetry with Progressive Disclosure */}
      <RevenueConsole
        metrics={metrics}
        onNavigateExpiring={() => onNavigate('expiring')}
        onNavigateMembers={() => onNavigate('members')}
      />

      {/* Primary Actions — Thumb-friendly 48px CTAs */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => onNavigate('add-member')}
          className="h-12 rounded-2xl bg-[#1A3EEA] hover:bg-[#1534D8] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-xs font-bold text-white shadow-glow-blue tracking-wider cursor-pointer"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>+ ADD MEMBER</span>
        </button>

        <button
          onClick={onOpenLogFee}
          className="h-12 rounded-2xl bg-white hover:bg-[#F8FAFC] border border-[#E9ECEF] hover:border-[#1A3EEA]/40 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-xs font-bold text-[#0F172A] tracking-wider cursor-pointer shadow-apple-card"
        >
          <CreditCard className="w-4 h-4 text-[#1A3EEA]" />
          <span>COLLECT PKR 2.5K</span>
        </button>
      </div>

      {/* Recent Activity Feed — Styled like Reference Image "Recent Transaction" */}
      <div className="space-y-3 pt-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center space-x-1.5">
            <Receipt className="w-3.5 h-3.5 text-[#1A3EEA]" />
            <span>RECENT ACTIVITY</span>
          </h3>
          <button
            onClick={() => onNavigate('members')}
            className="text-xs font-bold text-[#1A3EEA] hover:text-[#1534D8] flex items-center gap-1 cursor-pointer tracking-wide"
          >
            <span>See all</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {metrics.recentPayments.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#94A3B8] bg-white border border-[#E9ECEF] rounded-2xl shadow-apple-card">
            No payments recorded yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {metrics.recentPayments.slice(0, 4).map((p, idx) => {
              const initials = p.member_name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="p-4 bg-white border border-[#E9ECEF] rounded-[24px] flex items-center justify-between shadow-apple-card hover:border-[#1A3EEA]/30 transition-colors"
                >
                  <div className="flex items-center space-x-3.5">
                    {/* Circle Avatar like "WJ" in reference image */}
                    <div className="w-10 h-10 rounded-full bg-[#EBF1FF] text-[#1A3EEA] font-extrabold text-xs flex items-center justify-center shrink-0 tracking-wider">
                      {initials}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-[#0F172A] tracking-normal">{p.member_name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] font-semibold tracking-wide">
                          {p.channel}
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8] tracking-wide">
                        {p.fee_type === 'FIRST_MONTH_PACKAGE' ? 'Month 1 Package' : 'Monthly Renewal'}{' '}
                        • {formatDateTime(p.paid_at)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right pl-2">
                    <span className="text-sm font-black text-[#1A3EEA] tracking-wide">
                      +{formatPKR(p.amount)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
