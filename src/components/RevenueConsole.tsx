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
        className="p-5 rounded-3xl bg-gradient-to-br from-[#121A28] via-[#101724] to-[#0A101A] border border-[#1E2B3E] shadow-2xl relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#10B981]/40 to-transparent" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase block">
                MONTHLY CAPITAL INFLOW
              </span>
              <span className="text-xs font-bold text-[#E2E8F0]">{currentMonthName}</span>
            </div>
          </div>

          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#6EE7B7] border border-[#10B981]/30 text-[10px] font-mono font-bold space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
            <span>ACTIVE TELEMETRY</span>
          </span>
        </div>

        {/* Big Gross Revenue Figure */}
        <div className="my-3 relative z-10">
          <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#E2E8F0] font-sans">
            {formatPKR(metrics.totalMonthlyRevenue)}
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-1 flex items-center gap-1 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
            Gross gym collection for active cycle
          </p>
        </div>

        {/* Split Telemetry: Admission One-Offs vs Regular PKR 2,500 Renewals */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[#1E2B3E] relative z-10">
          <div className="p-3 rounded-2xl bg-[#090D15]/80 border border-[#1A2536]">
            <span className="text-[10px] font-mono tracking-wider text-[#94A3B8] uppercase block">
              ADMISSION INFLOW
            </span>
            <span className="text-sm font-extrabold text-[#E2E8F0] mt-0.5 block">
              {formatPKR(metrics.admissionRevenue)}
            </span>
            <span className="text-[10px] text-[#64748B] font-mono">Month 1 One-off</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#090D15]/80 border border-[#1A2536]">
            <span className="text-[10px] font-mono tracking-wider text-[#94A3B8] uppercase block">
              RECURRING RENEWALS
            </span>
            <span className="text-sm font-extrabold text-[#10B981] mt-0.5 block">
              {formatPKR(metrics.renewalRevenue)}
            </span>
            <span className="text-[10px] text-[#64748B] font-mono">PKR 2,500 Base Cycle</span>
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
          className="p-4 rounded-2xl bg-[#0F1522] border border-[#1E2B3E] hover:border-[#10B981]/50 transition-all cursor-pointer shadow-lg active:scale-[0.99] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono tracking-wider text-[#94A3B8] uppercase">
              ACTIVE ROSTER
            </span>
            <div className="p-1.5 rounded-lg bg-[#10B981]/10 text-[#10B981]">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <div className="text-2xl font-black text-[#E2E8F0]">
              {metrics.activeMembersCount}{' '}
              <span className="text-xs font-normal text-[#64748B]">/ {metrics.totalMembersCount}</span>
            </div>
            <div className="w-full h-1.5 bg-[#090D15] rounded-full overflow-hidden mt-2 border border-[#1A2536]">
              <div
                className="h-full bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full transition-all duration-700"
                style={{ width: `${activePercent}%` }}
              />
            </div>
            <span className="text-[10px] text-[#10B981] font-mono font-semibold mt-1.5 block">
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
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-lg active:scale-[0.99] flex flex-col justify-between ${
            metrics.expiringMembersCount > 0
              ? 'bg-gradient-to-br from-[#1C150B] to-[#120F08] border-[#F59E0B]/50 hover:border-[#F59E0B]'
              : 'bg-[#0F1522] border-[#1E2B3E] hover:border-[#2A3B54]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono tracking-wider text-[#94A3B8] uppercase">
              48H RADAR
            </span>
            <div
              className={`p-1.5 rounded-lg ${
                metrics.expiringMembersCount > 0
                  ? 'bg-[#F59E0B]/20 text-[#F59E0B] animate-pulse'
                  : 'bg-[#1E2B3E] text-[#64748B]'
              }`}
            >
              <ClockAlert className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <div
              className={`text-2xl font-black ${
                metrics.expiringMembersCount > 0 ? 'text-[#F59E0B]' : 'text-[#E2E8F0]'
              }`}
            >
              {metrics.expiringMembersCount}{' '}
              <span className="text-xs font-normal text-[#64748B]">Due</span>
            </div>

            <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#223048]">
              <span className="text-[10px] text-[#94A3B8] font-mono">
                {metrics.expiringMembersCount > 0 ? 'Alert Ready' : 'All Clear'}
              </span>
              <ArrowUpRight
                className={`w-3.5 h-3.5 ${
                  metrics.expiringMembersCount > 0 ? 'text-[#F59E0B]' : 'text-[#64748B]'
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
        className="p-4 rounded-3xl bg-[#0F1522] border border-[#1E2B3E] shadow-xl space-y-3.5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#10B981]" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#E2E8F0]">
              CHANNEL ALLOCATION
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#64748B]">All-Time Ledger</span>
        </div>

        <div className="space-y-3 pt-1">
          {metrics.channelStats.map((item) => {
            const Icon = channelIconMap[item.channel] || TrendingUp;
            return (
              <div key={item.channel} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="p-1 rounded-md bg-[#162032] text-[#94A3B8] border border-[#223048]">
                      <Icon className="w-3.5 h-3.5 text-[#10B981]" />
                    </div>
                    <span className="font-semibold text-[#E2E8F0]">{item.label}</span>
                  </div>

                  <div className="text-right font-mono">
                    <span className="font-extrabold text-[#E2E8F0]">{formatPKR(item.amount)}</span>
                    <span className="text-[10px] text-[#64748B] ml-1.5">
                      ({item.count} txns)
                    </span>
                  </div>
                </div>

                {/* Precision Allocation Progress Bar */}
                <div className="w-full h-1.5 bg-[#090D15] rounded-full overflow-hidden border border-[#1A2536]">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      item.channel === 'CASH'
                        ? 'bg-[#10B981]'
                        : item.channel === 'EASYPAISA'
                        ? 'bg-[#34D399]'
                        : item.channel === 'JAZZCASH'
                        ? 'bg-[#F59E0B]'
                        : 'bg-[#38BDF8]'
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
