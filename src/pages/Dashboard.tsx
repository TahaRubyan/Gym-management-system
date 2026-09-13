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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7fb6ac]"></div>
      </div>
    );
  }

  const currentMonthName = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-4 pb-28 px-4 pt-2 max-w-md mx-auto select-none">
      {/* Top Header — Clean & Accessible */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#7fb6ac] uppercase tracking-wider">
            DASTAGIR KANTH • MONSTER GYM
          </span>
          <h2 className="text-xl font-bold text-[#9ba9c2] tracking-tight">
            {currentMonthName}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-[#6c7674] block">ROSTER</span>
          <span className="text-sm font-bold text-[#9ba9c2]">
            {metrics.activeMembersCount} / {metrics.totalMembersCount} Active
          </span>
        </div>
      </div>

      {/* Main Revenue Telemetry with Progressive Disclosure */}
      <RevenueConsole
        metrics={metrics}
        onNavigateExpiring={() => onNavigate('expiring')}
        onNavigateMembers={() => onNavigate('members')}
      />

      {/* Primary Actions — Thumb-friendly 48px CTAs (Figma Spec) */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          onClick={() => onNavigate('add-member')}
          className="h-12 rounded-xl bg-[#7fb6ac] hover:bg-[#70a59b] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-xs font-mono font-black text-[#0c1012] shadow-glow-mint cursor-pointer"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>+ ADD MEMBER</span>
        </button>

        <button
          onClick={onOpenLogFee}
          className="h-12 rounded-xl bg-[#182023] hover:bg-[#1f282c] border border-[#2a3639] hover:border-[#7fb6ac]/40 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-xs font-mono font-bold text-[#9ba9c2] cursor-pointer shadow-sm"
        >
          <CreditCard className="w-4 h-4 text-[#7fb6ac]" />
          <span>COLLECT PKR 2.5K</span>
        </button>
      </div>

      {/* Recent Activity Feed — Minimalist (Last 3 Items) */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#9ba9c2] flex items-center space-x-1.5">
            <Receipt className="w-3.5 h-3.5 text-[#7fb6ac]" />
            <span>RECENT ACTIVITY</span>
          </h3>
          <button
            onClick={() => onNavigate('members')}
            className="text-[11px] font-mono text-[#7fb6ac] hover:text-[#9ba9c2] flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {metrics.recentPayments.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#6c7674] bg-[#182023] border border-[#2a3639] rounded-2xl font-mono">
            No payments recorded yet.
          </div>
        ) : (
          <div className="space-y-2">
            {metrics.recentPayments.slice(0, 3).map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                className="p-3.5 bg-[#182023] border border-[#2a3639] rounded-xl flex items-center justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#9ba9c2]">{p.member_name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#13191b] text-[#67758d] font-mono font-semibold border border-[#2a3639]">
                      {p.channel}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6c7674] mt-0.5 font-mono">
                    {p.fee_type === 'FIRST_MONTH_PACKAGE' ? 'Month 1' : 'Renewal'}{' '}
                    • {formatDateTime(p.paid_at)}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-black text-[#7fb6ac]">
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
