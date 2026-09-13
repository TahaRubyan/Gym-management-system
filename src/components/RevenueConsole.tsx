import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Wallet,
  Users,
  ClockAlert,
  ArrowUpRight,
  Layers,
  Banknote,
  Smartphone,
  Building,
  ChevronDown,
  ChevronUp,
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
    <div className="space-y-3 select-none">
      {/* 1. Hero Revenue Card — Minimal & High Scannability */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-5 rounded-3xl bg-white border border-[#EAE2D6] shadow-apple-card relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#8B9A6E]/15 text-[#8B9A6E] flex items-center justify-center border border-[#8B9A6E]/30">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold tracking-wider text-[#5B675E] uppercase block">
                MONTHLY INFLOW
              </span>
              <span className="text-xs font-semibold text-[#1C221D]">{currentMonthName}</span>
            </div>
          </div>

          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#8B9A6E]/15 text-[#5E6D45] border border-[#8B9A6E]/30 text-[10px] font-mono font-bold space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B9A6E] animate-pulse" />
            <span>COLLECTION</span>
          </span>
        </div>

        {/* Big Gross Revenue Figure */}
        <div className="my-2">
          <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#1C221D] font-sans">
            {formatPKR(metrics.totalMonthlyRevenue)}
          </div>
        </div>

        {/* Progressive Disclosure Action: Reveal Breakdown */}
        <button
          onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
          className="w-full mt-3 pt-3 border-t border-[#EAE2D6] flex items-center justify-between text-xs font-mono font-bold text-[#8B9A6E] hover:text-[#5E6D45] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5 font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>{showDetailedBreakdown ? 'Hide Breakdown' : 'View Financial Breakdown & Channels'}</span>
          </span>
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
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#EAE2D6]">
                <div className="p-3 rounded-2xl bg-[#F7F2EB] border border-[#EAE2D6]">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-[#5B675E] uppercase block">
                    ADMISSION INFLOW
                  </span>
                  <span className="text-sm font-extrabold text-[#1C221D] mt-0.5 block">
                    {formatPKR(metrics.admissionRevenue)}
                  </span>
                  <span className="text-[10px] text-[#8E9A90] font-mono">One-off initial</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#F7F2EB] border border-[#EAE2D6]">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-[#5B675E] uppercase block">
                    RECURRING RENEWALS
                  </span>
                  <span className="text-sm font-extrabold text-[#8B9A6E] mt-0.5 block">
                    {formatPKR(metrics.renewalRevenue)}
                  </span>
                  <span className="text-[10px] text-[#8E9A90] font-mono">PKR 2,500 base</span>
                </div>
              </div>

              {/* Payment Channel Breakdown */}
              <div className="p-3.5 rounded-2xl bg-[#F7F2EB] border border-[#EAE2D6] space-y-3">
                <span className="text-[11px] font-mono font-bold text-[#1C221D] uppercase tracking-wider block">
                  PAYMENT CHANNELS
                </span>
                <div className="space-y-2.5">
                  {metrics.channelStats.map((item) => {
                    const Icon = channelIconMap[item.channel] || TrendingUp;
                    return (
                      <div key={item.channel} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-3.5 h-3.5 text-[#8B9A6E]" />
                            <span className="font-bold text-[#1C221D]">{item.label}</span>
                          </div>
                          <div className="text-right font-mono">
                            <span className="font-bold text-[#1C221D]">{formatPKR(item.amount)}</span>
                            <span className="text-[10px] text-[#8E9A90] ml-1">
                              ({item.count})
                            </span>
                          </div>
                        </div>

                        <div className="w-full h-1.5 bg-[#EEEEEE] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.channel === 'CASH'
                                ? 'bg-[#8B9A6E]'
                                : item.channel === 'EASYPAISA'
                                ? 'bg-[#5B675E]'
                                : item.channel === 'JAZZCASH'
                                ? 'bg-[#A3B18A]'
                                : 'bg-[#8E9A90]'
                            }`}
                            style={{ width: `${Math.max(item.percentage, item.amount > 0 ? 4 : 0)}%` }}
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

      {/* 2. Quick Glance Tiles: Active Roster & 48H Radar */}
      <div className="grid grid-cols-2 gap-3">
        {/* Active Members Tile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onClick={onNavigateMembers}
          className="p-4 rounded-3xl bg-white border border-[#EAE2D6] hover:border-[#8B9A6E]/50 transition-all cursor-pointer shadow-apple-card active:scale-[0.98] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono font-bold tracking-wider text-[#8E9A90] uppercase">
              ACTIVE ROSTER
            </span>
            <Users className="w-4 h-4 text-[#8B9A6E]" />
          </div>

          <div>
            <div className="text-2xl font-black text-[#1C221D]">
              {metrics.activeMembersCount}{' '}
              <span className="text-xs font-normal text-[#8E9A90]">/ {metrics.totalMembersCount}</span>
            </div>
            <div className="w-full h-1.5 bg-[#EEEEEE] rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-[#8B9A6E] rounded-full"
                style={{ width: `${activePercent}%` }}
              />
            </div>
            <span className="text-[10px] text-[#5E6D45] font-mono font-bold mt-1.5 block">
              {activePercent}% Healthy
            </span>
          </div>
        </motion.div>

        {/* 48-Hour Radar Tile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          onClick={onNavigateExpiring}
          className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-apple-card active:scale-[0.98] flex flex-col justify-between ${
            metrics.expiringMembersCount > 0
              ? 'bg-white border-[#8B9A6E]/60 ring-1 ring-[#8B9A6E]/20'
              : 'bg-white border-[#EAE2D6] hover:border-[#8B9A6E]/40'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono font-bold tracking-wider text-[#8E9A90] uppercase">
              48H RADAR
            </span>
            <ClockAlert
              className={`w-4 h-4 ${
                metrics.expiringMembersCount > 0 ? 'text-[#8B9A6E] animate-pulse' : 'text-[#8E9A90]'
              }`}
            />
          </div>

          <div>
            <div
              className={`text-2xl font-black ${
                metrics.expiringMembersCount > 0 ? 'text-[#8B9A6E]' : 'text-[#1C221D]'
              }`}
            >
              {metrics.expiringMembersCount}{' '}
              <span className="text-xs font-normal text-[#8E9A90]">Due</span>
            </div>

            <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#EAE2D6]">
              <span className="text-[10px] text-[#5B675E] font-mono font-bold">
                {metrics.expiringMembersCount > 0 ? 'Action Needed' : 'All Clear'}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#8B9A6E]" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
