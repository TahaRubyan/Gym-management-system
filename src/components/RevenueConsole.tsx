import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Users,
  ClockAlert,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Banknote,
  Smartphone,
  Building,
} from 'lucide-react';
import { DashboardMetrics, PaymentChannel } from '../types/gym';
import { formatPKR } from '../utils/dateAndPhone';

interface RevenueConsoleProps {
  metrics: DashboardMetrics;
  onNavigateExpiring: () => void;
  onNavigateMembers: () => void;
}

export const RevenueConsole: React.FC<RevenueConsoleProps> = ({
  metrics,
  onNavigateExpiring,
  onNavigateMembers,
}) => {
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  const currentMonthName = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const activePercent =
    metrics.totalMembersCount > 0
      ? Math.round((metrics.activeMembersCount / metrics.totalMembersCount) * 100)
      : 0;

  const channelIconMap: Record<PaymentChannel, React.ComponentType<{ className?: string }>> = {
    CASH: Banknote,
    EASYPAISA: Smartphone,
    JAZZCASH: Smartphone,
    BANK_TRANSFER: Building,
  };

  return (
    <div className="space-y-3.5 select-none">
      {/* 1. Hero Revenue Card — Modern Fintech Style from Reference Image */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-5 sm:p-6 rounded-[28px] bg-white border border-[#E9ECEF] shadow-apple-card relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
            Total Inflow
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#EBF1FF] text-[#1A3EEA] text-xs font-bold tracking-wide">
            {currentMonthName}
          </span>
        </div>

        {/* Big Gross Revenue Figure */}
        <div className="text-3xl sm:text-4xl font-black tracking-normal text-[#0F172A] my-3 leading-tight">
          {formatPKR(metrics.totalMonthlyRevenue)}
        </div>

        {/* Reference Image SVG Sparkline Graphic */}
        <div className="relative w-full h-16 my-1">
          <svg viewBox="0 0 320 60" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="blueGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1A3EEA" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#1A3EEA" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Soft grid line */}
            <line x1="0" y1="30" x2="320" y2="30" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
            {/* Area fill */}
            <path
              d="M 0 45 Q 60 15, 120 35 T 240 20 T 320 15 L 320 60 L 0 60 Z"
              fill="url(#blueGlow)"
            />
            {/* Main Sparkline Curve */}
            <path
              d="M 0 45 Q 60 15, 120 35 T 240 20 T 320 15"
              fill="none"
              stroke="#1A3EEA"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Active Highlight Marker (like the 6.85t tag in reference image) */}
            <circle cx="240" cy="20" r="4.5" fill="#1A3EEA" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
          <div className="absolute right-[22%] top-[-8px] -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-[#1A3EEA] text-white text-[9px] font-bold shadow-sm">
            Active
          </div>
        </div>

        {/* Progressive Disclosure Toggle */}
        <button
          onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
          className="w-full mt-2 pt-3 border-t border-[#E9ECEF] flex items-center justify-between text-xs font-semibold text-[#1A3EEA] hover:text-[#1534D8] transition-colors cursor-pointer"
        >
          <span>{showDetailedBreakdown ? 'Hide Breakdown' : 'View Financial Breakdown & Channels'}</span>
          {showDetailedBreakdown ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {/* Expandable Section: Admission vs Renewals & Channel Allocation */}
        <AnimatePresence>
          {showDetailedBreakdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 pt-3 overflow-hidden"
            >
              {/* Split: Admission vs Recurring Renewals */}
              <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-[#E9ECEF]">
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E9ECEF]">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase block">
                    ADMISSION INFLOW
                  </span>
                  <span className="text-base font-black text-[#0F172A] mt-0.5 block">
                    {formatPKR(metrics.admissionRevenue)}
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">One-off fees</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E9ECEF]">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase block">
                    RECURRING RENEWALS
                  </span>
                  <span className="text-base font-black text-[#1A3EEA] mt-0.5 block">
                    {formatPKR(metrics.renewalRevenue)}
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">PKR 2,500 base</span>
                </div>
              </div>

              {/* Payment Channel Breakdown */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E9ECEF] space-y-3">
                <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider block">
                  PAYMENT CHANNELS
                </span>
                <div className="space-y-2.5">
                  {metrics.channelStats.map((item) => {
                    const Icon = channelIconMap[item.channel] || TrendingUp;
                    return (
                      <div key={item.channel} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-3.5 h-3.5 text-[#1A3EEA]" />
                            <span className="font-semibold text-[#0F172A]">{item.label}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-[#0F172A]">{formatPKR(item.amount)}</span>
                            <span className="text-[10px] text-[#94A3B8] ml-1 font-medium">
                              ({item.count})
                            </span>
                          </div>
                        </div>

                        <div className="w-full h-1.5 bg-[#E9ECEF] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.channel === 'CASH'
                                ? 'bg-[#1A3EEA]'
                                : item.channel === 'EASYPAISA'
                                ? 'bg-[#002DE3]'
                                : item.channel === 'JAZZCASH'
                                ? 'bg-[#4361EE]'
                                : 'bg-[#64748B]'
                            }`}
                            style={{ width: `${Math.max(item.percentage, item.amount > 0 ? 5 : 0)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 2. Side-by-Side Stat Cards — Styled exactly like Income / Expense in Reference Image */}
      <div className="grid grid-cols-2 gap-3">
        {/* Renewals Mini Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-4 rounded-[24px] bg-white border border-[#E9ECEF] shadow-apple-card flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#64748B] tracking-wide uppercase">Renewals</span>
            <div className="w-7 h-7 rounded-full bg-[#EBF1FF] text-[#1A3EEA] flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-normal">
            {formatPKR(metrics.renewalRevenue)}
          </div>
        </motion.div>

        {/* Admissions Mini Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="p-4 sm:p-5 rounded-[24px] bg-white border border-[#E9ECEF] shadow-apple-card flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#64748B] tracking-wide uppercase">Admissions</span>
            <div className="w-7 h-7 rounded-full bg-[#EBF1FF] text-[#1A3EEA] flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-normal">
            {formatPKR(metrics.admissionRevenue)}
          </div>
        </motion.div>
      </div>

      {/* 3. Activity / Urgency Highlight Card (From Reference Image "Your Activity" design) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Active Roster Health */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          onClick={onNavigateMembers}
          className="p-4 rounded-[24px] bg-white border border-[#E9ECEF] hover:border-[#1A3EEA]/40 transition-all cursor-pointer shadow-apple-card flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-[#64748B]">Active Roster</span>
            <Users className="w-4 h-4 text-[#1A3EEA]" />
          </div>
          <div>
            <div className="text-xl font-black text-[#0F172A]">
              {metrics.activeMembersCount} <span className="text-xs font-normal text-[#94A3B8]">/ {metrics.totalMembersCount}</span>
            </div>
            <div className="w-full h-1.5 bg-[#E9ECEF] rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-[#1A3EEA] rounded-full"
                style={{ width: `${activePercent}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* 48H Urgency Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          onClick={onNavigateExpiring}
          className={`p-4 rounded-[24px] border transition-all cursor-pointer shadow-apple-card flex flex-col justify-between ${
            metrics.expiringMembersCount > 0
              ? 'bg-[#1A3EEA] text-white border-[#1A3EEA] shadow-glow-blue'
              : 'bg-white text-[#0F172A] border-[#E9ECEF]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-semibold ${metrics.expiringMembersCount > 0 ? 'text-white/80' : 'text-[#64748B]'}`}>
              48H Radar
            </span>
            <ClockAlert className={`w-4 h-4 ${metrics.expiringMembersCount > 0 ? 'text-white' : 'text-[#94A3B8]'}`} />
          </div>
          <div>
            <div className="text-xl font-black">
              {metrics.expiringMembersCount} Due
            </div>
            <span className={`text-[11px] font-medium block mt-1 ${metrics.expiringMembersCount > 0 ? 'text-white/90' : 'text-[#1A3EEA]'}`}>
              {metrics.expiringMembersCount > 0 ? 'Tap to remind →' : 'All clear'}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
