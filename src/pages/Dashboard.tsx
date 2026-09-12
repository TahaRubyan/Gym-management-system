import React from 'react';
import { motion } from 'motion/react';
import {
  CreditCard,
  UserPlus,
  Receipt,
  Sparkles,
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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  const currentMonthName = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-4 pb-28 px-4 pt-2 max-w-md mx-auto select-none">
      {/* Executive Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#6EE7B7] uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
            EXECUTIVE CONSOLE
          </span>
          <h2 className="text-xl font-black text-[#E2E8F0] tracking-tight font-sans">
            {currentMonthName}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-[#94A3B8] block">GYM ROSTER</span>
          <span className="text-sm font-extrabold text-[#E2E8F0]">
            {metrics.activeMembersCount} Active / {metrics.totalMembersCount}
          </span>
        </div>
      </div>

      {/* Main Revenue Telemetry Console */}
      <RevenueConsole
        metrics={metrics}
        onNavigateExpiring={() => onNavigate('expiring')}
        onNavigateMembers={() => onNavigate('members')}
      />

      {/* Quick Launch Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => onNavigate('add-member')}
          className="p-3.5 rounded-2xl bg-[#0F1522] hover:bg-[#162032] border border-[#1E2B3E] hover:border-[#10B981]/40 flex items-center justify-center space-x-2 text-xs font-mono font-bold text-[#E2E8F0] transition-all active:scale-95 shadow-lg"
        >
          <UserPlus className="w-4 h-4 text-[#10B981]" />
          <span>NEW REGISTRATION</span>
        </button>

        <button
          onClick={onOpenLogFee}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-[#10B981]/20 via-[#059669]/20 to-[#047857]/20 hover:from-[#10B981]/30 hover:to-[#059669]/30 border border-[#10B981]/40 flex items-center justify-center space-x-2 text-xs font-mono font-bold text-[#6EE7B7] transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
        >
          <CreditCard className="w-4 h-4" />
          <span>COLLECT PKR 2.5K</span>
        </button>
      </div>

      {/* Recent Ledger Activity Feed */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#94A3B8] flex items-center space-x-1.5">
            <Receipt className="w-3.5 h-3.5 text-[#10B981]" />
            <span>RECENT LEDGER FEED</span>
          </h3>
          <span className="text-[10px] font-mono text-[#64748B]">Real-Time Dexie</span>
        </div>

        {metrics.recentPayments.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#64748B] bg-[#0F1522] border border-[#1E2B3E] rounded-2xl">
            No payments recorded yet.
          </div>
        ) : (
          <div className="space-y-2">
            {metrics.recentPayments.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-3.5 bg-[#0F1522] border border-[#1E2B3E] hover:border-[#223048] rounded-xl flex items-center justify-between shadow-md"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#E2E8F0]">{p.member_name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#162032] text-[#94A3B8] font-mono font-semibold border border-[#223048]">
                      {p.channel}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5 font-mono">
                    {p.fee_type === 'FIRST_MONTH_PACKAGE' ? 'Admission + Month 1' : 'Renewal'}{' '}
                    • {formatDateTime(p.paid_at)}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-black text-[#6EE7B7]">
                    {formatPKR(p.amount)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
