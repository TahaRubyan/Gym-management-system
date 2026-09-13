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
        className="p-5 rounded-2xl bg-[#182023] border border-[#2a3639] shadow-sm relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#7fb6ac]/15 text-[#7fb6ac] flex items-center justify-center border border-[#7fb6ac]/30">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-mono tracking-wider text-[#6c7674] uppercase block">
                MONTHLY INFLOW
              </span>
              <span className="text-xs font-semibold text-[#9ba9c2]">{currentMonthName}</span>
            </div>
          </div>

          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#7fb6ac]/15 text-[#7fb6ac] border border-[#7fb6ac]/30 text-[10px] font-mono font-bold space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7fb6ac] animate-pulse" />
            <span>COLLECTION</span>
          </span>
        </div>

        {/* Big Gross Revenue Figure */}
        <div className="my-2">
          <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#9ba9c2] font-sans">
            {formatPKR(metrics.totalMonthlyRevenue)}
          </div>
        </div>

        {/* Progressive Disclosure Action: Reveal Breakdown */}
        <button
          onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
          className="w-full mt-3 pt-3 border-t border-[#2a3639] flex items-center justify-between text-xs font-mono text-[#7fb6ac] hover:text-[#9ba9c2] transition-colors cursor-pointer"
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
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#2a3639]">
                <div className="p-3 rounded-xl bg-[#13191b] border border-[#2a3639]">
                  <span className="text-[10px] font-mono tracking-wider text-[#6c7674] uppercase block">
                    ADMISSION INFLOW
                  </span>
                  <span className="text-sm font-extrabold text-[#9ba9c2] mt-0.5 block">
                    {formatPKR(metrics.admissionRevenue)}
                  </span>
                  <span className="text-[10px] text-[#67758d] font-mono">One-off initial</span>
                </div>

                <div className="p-3 rounded-xl bg-[#13191b] border border-[#2a3639]">
                  <span className="text-[10px] font-mono tracking-wider text-[#6c7674] uppercase block">
                    RECURRING RENEWALS
                  </span>
                  <span className="text-sm font-extrabold text-[#7fb6ac] mt-0.5 block">
                    {formatPKR(metrics.renewalRevenue)}
                  </span>
                  <span className="text-[10px] text-[#67758d] font-mono">PKR 2,500 base</span>
                </div>
              </div>

              {/* Payment Channel Breakdown */}
              <div className="p-3.5 rounded-xl bg-[#13191b] border border-[#2a3639] space-y-3">
                <span className="text-[11px] font-mono font-bold text-[#9ba9c2] uppercase tracking-wider block">
                  PAYMENT CHANNELS
                </span>
                <div className="space-y-2.5">
                  {metrics.channelStats.map((item) => {
                    const Icon = channelIconMap[item.channel] || TrendingUp;
                    return (
                      <div key={item.channel} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-3.5 h-3.5 text-[#7fb6ac]" />
                            <span className="font-semibold text-[#9ba9c2]">{item.label}</span>
                          </div>
                          <div className="text-right font-mono">
                            <span className="font-bold text-[#9ba9c2]">{formatPKR(item.amount)}</span>
                            <span className="text-[10px] text-[#6c7674] ml-1">
                              ({item.count})
                            </span>
                          </div>
                        </div>

                        <div className="w-full h-1.5 bg-[#0c1012] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.channel === 'CASH'
                                ? 'bg-[#7fb6ac]'
                                : item.channel === 'EASYPAISA'
                                ? 'bg-[#9ba9c2]'
                                : item.channel === 'JAZZCASH'
                                ? 'bg-[#67758d]'
                                : 'bg-[#6c7674]'
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
          className="p-4 rounded-2xl bg-[#182023] border border-[#2a3639] hover:border-[#7fb6ac]/50 transition-all cursor-pointer shadow-sm active:scale-[0.98] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono tracking-wider text-[#6c7674] uppercase">
              ACTIVE ROSTER
            </span>
            <Users className="w-4 h-4 text-[#7fb6ac]" />
          </div>

          <div>
            <div className="text-2xl font-black text-[#9ba9c2]">
              {metrics.activeMembersCount}{' '}
              <span className="text-xs font-normal text-[#6c7674]">/ {metrics.totalMembersCount}</span>
            </div>
            <div className="w-full h-1 bg-[#13191b] rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-[#7fb6ac] rounded-full"
                style={{ width: `${activePercent}%` }}
              />
            </div>
            <span className="text-[10px] text-[#7fb6ac] font-mono font-semibold mt-1 block">
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
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm active:scale-[0.98] flex flex-col justify-between ${
            metrics.expiringMembersCount > 0
              ? 'bg-[#182023] border-[#7fb6ac]/60 hover:border-[#7fb6ac]'
              : 'bg-[#182023] border-[#2a3639] hover:border-[#67758d]'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono tracking-wider text-[#6c7674] uppercase">
              48H RADAR
            </span>
            <ClockAlert
              className={`w-4 h-4 ${
                metrics.expiringMembersCount > 0 ? 'text-[#7fb6ac] animate-pulse' : 'text-[#6c7674]'
              }`}
            />
          </div>

          <div>
            <div
              className={`text-2xl font-black ${
                metrics.expiringMembersCount > 0 ? 'text-[#7fb6ac]' : 'text-[#9ba9c2]'
              }`}
            >
              {metrics.expiringMembersCount}{' '}
              <span className="text-xs font-normal text-[#6c7674]">Due</span>
            </div>

            <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#2a3639]">
              <span className="text-[10px] text-[#67758d] font-mono">
                {metrics.expiringMembersCount > 0 ? 'Action Needed' : 'All Clear'}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#7fb6ac]" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
