import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Wallet,
  Users,
  ClockAlert,
  ArrowUpRight,
  Sparkles,
  Layers,
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
    <div className="space-y-4 select-none">
      {/* Hero: Institutional Gross Revenue Telemetry Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-5 rounded-3xl bg-[#182023] border border-[#2a3639] shadow-xl relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#7fb6ac]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#7fb6ac]/60 to-transparent" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#7fb6ac]/15 text-[#7fb6ac] border border-[#7fb6ac]/30">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#6c7674] uppercase block">
                MONTHLY CAPITAL INFLOW
              </span>
              <span className="text-xs font-bold text-[#9ba9c2]">{currentMonthName}</span>
            </div>
          </div>

          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#7fb6ac]/15 text-[#7fb6ac] border border-[#7fb6ac]/30 text-[10px] font-mono font-bold space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7fb6ac] animate-pulse" />
            <span>LIVE INFLOW</span>
          </span>
        </div>

        {/* Big Gross Revenue Figure */}
        <div className="my-3 relative z-10">
          <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#9ba9c2] font-sans">
            {formatPKR(metrics.totalMonthlyRevenue)}
          </div>
          <p className="text-[11px] text-[#6c7674] mt-1 flex items-center gap-1 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#7fb6ac]" />
            Gross gym collection for active cycle
          </p>
        </div>

        {/* Split Telemetry: Admission One-Offs vs Regular PKR 2,500 Renewals */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[#2a3639] relative z-10">
          <div className="p-3 rounded-2xl bg-[#13191b] border border-[#2a3639]">
            <span className="text-[10px] font-mono tracking-wider text-[#6c7674] uppercase block">
              ADMISSION INFLOW
            </span>
            <span className="text-sm font-extrabold text-[#9ba9c2] mt-0.5 block">
              {formatPKR(metrics.admissionRevenue)}
            </span>
            <span className="text-[10px] text-[#67758d] font-mono">Month 1 One-off</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#13191b] border border-[#2a3639]">
            <span className="text-[10px] font-mono tracking-wider text-[#6c7674] uppercase block">
              RECURRING RENEWALS
            </span>
            <span className="text-sm font-extrabold text-[#7fb6ac] mt-0.5 block">
              {formatPKR(metrics.renewalRevenue)}
            </span>
            <span className="text-[10px] text-[#67758d] font-mono">PKR 2,500 Base Rate</span>
          </div>
        </div>
      </motion.div>

      {/* Two Telemetry Gauges: Roster Status & 48h Radar */}
      <div className="grid grid-cols-2 gap-3">
        {/* Active Members Ratio Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onClick={onNavigateMembers}
          className="p-4 rounded-2xl bg-[#182023] border border-[#2a3639] hover:border-[#7fb6ac]/50 transition-all cursor-pointer shadow-md active:scale-[0.99] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono tracking-wider text-[#6c7674] uppercase">
              ACTIVE ROSTER
            </span>
            <div className="p-1.5 rounded-lg bg-[#7fb6ac]/15 text-[#7fb6ac]">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <div className="text-2xl font-black text-[#9ba9c2]">
              {metrics.activeMembersCount}{' '}
              <span className="text-xs font-normal text-[#6c7674]">/ {metrics.totalMembersCount}</span>
            </div>
            <div className="w-full h-1.5 bg-[#13191b] rounded-full overflow-hidden mt-2 border border-[#2a3639]">
              <div
                className="h-full bg-[#7fb6ac] rounded-full transition-all duration-700"
                style={{ width: `${activePercent}%` }}
              />
            </div>
            <span className="text-[10px] text-[#7fb6ac] font-mono font-semibold mt-1.5 block">
              {activePercent}% Roster Healthy
            </span>
          </div>
        </motion.div>

        {/* 48-Hour Expiry Radar Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onClick={onNavigateExpiring}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-md active:scale-[0.99] flex flex-col justify-between ${
            metrics.expiringMembersCount > 0
              ? 'bg-[#182023] border-[#7fb6ac]/60 hover:border-[#7fb6ac]'
              : 'bg-[#182023] border-[#2a3639] hover:border-[#67758d]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono tracking-wider text-[#6c7674] uppercase">
              48H RADAR
            </span>
            <div
              className={`p-1.5 rounded-lg ${
                metrics.expiringMembersCount > 0
                  ? 'bg-[#7fb6ac]/20 text-[#7fb6ac] animate-pulse'
                  : 'bg-[#182023] text-[#6c7674]'
              }`}
            >
              <ClockAlert className="w-3.5 h-3.5" />
            </div>
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
                {metrics.expiringMembersCount > 0 ? 'Alert Ready' : 'All Clear'}
              </span>
              <ArrowUpRight
                className={`w-3.5 h-3.5 ${
                  metrics.expiringMembersCount > 0 ? 'text-[#7fb6ac]' : 'text-[#6c7674]'
                }`}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Multi-Channel Capital Allocation Telemetry Console */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="p-4 rounded-3xl bg-[#182023] border border-[#2a3639] shadow-lg space-y-3.5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#7fb6ac]" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#9ba9c2]">
              CHANNEL ALLOCATION
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#6c7674]">All-Time Ledger</span>
        </div>

        <div className="space-y-3 pt-1">
          {metrics.channelStats.map((item) => {
            const Icon = channelIconMap[item.channel] || TrendingUp;
            return (
              <div key={item.channel} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="p-1 rounded-md bg-[#13191b] text-[#9ba9c2] border border-[#2a3639]">
                      <Icon className="w-3.5 h-3.5 text-[#7fb6ac]" />
                    </div>
                    <span className="font-semibold text-[#9ba9c2]">{item.label}</span>
                  </div>

                  <div className="text-right font-mono">
                    <span className="font-extrabold text-[#9ba9c2]">{formatPKR(item.amount)}</span>
                    <span className="text-[10px] text-[#6c7674] ml-1.5">
                      ({item.count} txns)
                    </span>
                  </div>
                </div>

                {/* Allocation Progress Bar styled with custom palette */}
                <div className="w-full h-1.5 bg-[#13191b] rounded-full overflow-hidden border border-[#2a3639]">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      item.channel === 'CASH'
                        ? 'bg-[#7fb6ac]'
                        : item.channel === 'EASYPAISA'
                        ? 'bg-[#9ba9c2]'
                        : item.channel === 'JAZZCASH'
                        ? 'bg-[#67758d]'
                        : 'bg-[#6c7674]'
                    }`}
                    style={{ width: `${Math.max(item.percentage, item.amount > 0 ? 3 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
