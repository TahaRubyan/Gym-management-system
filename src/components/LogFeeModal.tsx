import React, { useState, useEffect } from 'react';
import { X, Check, Calendar, CreditCard, User, AlertCircle, ArrowRight } from 'lucide-react';
import { Member, PaymentChannel } from '../types/gym';
import {
  BASE_MONTHLY_FEE,
  calculateRenewalExpiry,
  formatDisplayDate,
  formatPKR,
  getTodayIso,
} from '../utils/dateAndPhone';
import { renewMembership } from '../services/storage';

interface LogFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  preselectedMember?: Member | null;
  onSuccess: (memberName: string, newExpiry: string, amount: number) => void;
}

export const LogFeeModal: React.FC<LogFeeModalProps> = ({
  isOpen,
  onClose,
  members,
  preselectedMember,
  onSuccess,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [channel, setChannel] = useState<PaymentChannel>('CASH');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(getTodayIso());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedMember) {
      setSelectedMemberId(preselectedMember.id);
    } else if (members.length > 0 && !selectedMemberId) {
      setSelectedMemberId(members[0].id);
    }
  }, [preselectedMember, members, selectedMemberId]);

  if (!isOpen) return null;

  const currentMember = members.find((m) => m.id === selectedMemberId) || preselectedMember;

  const projectedNewExpiry = currentMember
    ? calculateRenewalExpiry(currentMember.expiry_date, paymentDate)
    : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMember) {
      setError('Please select a member');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const result = await renewMembership({
        member_id: currentMember.id,
        amount: BASE_MONTHLY_FEE,
        channel,
        transaction_ref: transactionRef.trim() || undefined,
        paid_at: paymentDate,
      });

      onSuccess(result.member.full_name, result.member.expiry_date, BASE_MONTHLY_FEE);
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to record fee renewal';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const channels: { id: PaymentChannel; label: string; badge: string }[] = [
    { id: 'CASH', label: 'Cash', badge: '💵 Front Desk' },
    { id: 'EASYPAISA', label: 'EasyPaisa', badge: '📱 Mobile Direct' },
    { id: 'JAZZCASH', label: 'JazzCash', badge: '📱 Mobile Direct' },
    { id: 'BANK_TRANSFER', label: 'Bank / Raast', badge: '🏦 IBFT Transfer' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div
        className="w-full max-w-md bg-[#0F1522] border-t sm:border border-[#1E2B3E] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col pb-[env(safe-area-inset-bottom,16px)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#1E2B3E] flex items-center justify-between bg-[#121A28]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#E2E8F0] leading-tight">
                Log Monthly Fee
              </h2>
              <p className="text-[11px] text-[#94A3B8] font-mono">30-Day Auto Extension • Monster Gym</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#1E2B3E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 flex items-center space-x-2 text-[#FCA5A5] text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Member Selector */}
          <div>
            <label className="block text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Select Member
            </label>
            {preselectedMember ? (
              <div className="p-3 bg-[#121A28] border border-[#1E2B3E] rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#10B981]/10 text-[#6EE7B7] border border-[#10B981]/25 font-bold text-sm flex items-center justify-center">
                    {preselectedMember.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#E2E8F0]">{preselectedMember.full_name}</p>
                    <p className="text-xs text-[#94A3B8] font-mono">{preselectedMember.phone}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#162032] text-[#94A3B8] border border-[#223048]">
                  Selected
                </span>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full bg-[#121A28] border border-[#1E2B3E] rounded-xl px-3.5 py-3 text-sm text-[#E2E8F0] focus:outline-none focus:border-[#10B981] transition-colors appearance-none font-sans"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name} ({m.phone}) — {m.status}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#94A3B8]">
                  <User className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          {/* Expiry Extension Preview Box */}
          {currentMember && (
            <div className="p-3.5 bg-gradient-to-r from-[#121A28] to-[#0D1420] border border-[#1E2B3E] rounded-2xl font-mono">
              <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                RENEWAL LIFECYCLE PROJECTION
              </p>
              <div className="flex items-center justify-between text-xs">
                <div className="text-left">
                  <span className="text-[#64748B] block text-[10px]">CURRENT EXPIRY</span>
                  <span className="font-bold text-[#E2E8F0] text-sm">
                    {formatDisplayDate(currentMember.expiry_date)}
                  </span>
                </div>
                <div className="flex flex-col items-center px-2">
                  <span className="text-[10px] text-[#6EE7B7] font-bold">+30 DAYS</span>
                  <ArrowRight className="w-4 h-4 text-[#10B981] my-0.5" />
                </div>
                <div className="text-right">
                  <span className="text-[#64748B] block text-[10px]">NEW VALIDITY</span>
                  <span className="font-black text-[#6EE7B7] text-sm">
                    {formatDisplayDate(projectedNewExpiry)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Amount Box (Fixed at PKR 2,500) */}
          <div>
            <label className="block text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Monthly Base Fee
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={formatPKR(BASE_MONTHLY_FEE)}
                className="w-full bg-[#090D15] border border-[#1A2536] rounded-xl px-3.5 py-3 text-base font-mono font-black text-[#6EE7B7] tracking-wide cursor-not-allowed"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-medium text-[#64748B] bg-[#121A28] px-2 py-0.5 rounded border border-[#1E2B3E]">
                Fixed Rate
              </span>
            </div>
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Collection Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full bg-[#121A28] border border-[#1E2B3E] rounded-xl px-3.5 py-2.5 text-sm text-[#E2E8F0] focus:outline-none focus:border-[#10B981] font-mono"
              />
              <Calendar className="w-4 h-4 text-[#64748B] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Payment Channel Selector */}
          <div>
            <label className="block text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Payment Channel
            </label>
            <div className="grid grid-cols-2 gap-2">
              {channels.map((ch) => {
                const isSelected = channel === ch.id;
                return (
                  <button
                    type="button"
                    key={ch.id}
                    onClick={() => setChannel(ch.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#10B981]/15 border-[#10B981] text-[#E2E8F0] shadow-sm shadow-emerald-500/20'
                        : 'bg-[#121A28] border-[#1E2B3E] text-[#94A3B8] hover:border-[#2A3B54]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-[#E2E8F0]">{ch.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#10B981]" />}
                    </div>
                    <span className="text-[10px] text-[#64748B] mt-0.5 font-mono">{ch.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reference / Transaction ID */}
          <div>
            <label className="block text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Reference / Note <span className="text-[#64748B] font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., TRX-98231 or Cash Rec #12"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              className="w-full bg-[#121A28] border border-[#1E2B3E] rounded-xl px-3.5 py-2.5 text-sm text-[#E2E8F0] placeholder-[#64748B] focus:outline-none focus:border-[#10B981] font-mono"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !currentMember}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] hover:brightness-110 active:scale-[0.98] transition-all text-[#E2E8F0] font-mono font-black rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wide"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>
                {isSubmitting ? 'Recording Renewal...' : `Confirm PKR ${BASE_MONTHLY_FEE.toLocaleString()} Renewal`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
