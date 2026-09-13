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
    { id: 'CASH', label: 'Cash', badge: 'Front Desk' },
    { id: 'EASYPAISA', label: 'EasyPaisa', badge: 'Mobile Direct' },
    { id: 'JAZZCASH', label: 'JazzCash', badge: 'Mobile Direct' },
    { id: 'BANK_TRANSFER', label: 'Bank / Raast', badge: 'IBFT Online' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div
        className="w-full max-w-md bg-[#182023] border-t sm:border border-[#2a3639] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col pb-[env(safe-area-inset-bottom,16px)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle indicator (Figma spec: 36px x 4px, radius 2px, centered) */}
        <div className="pt-2.5 pb-1 flex justify-center bg-[#13191b]">
          <div className="w-9 h-1 rounded-full bg-[#2a3639]" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#2a3639] flex items-center justify-between bg-[#13191b]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#7fb6ac]/15 text-[#7fb6ac] flex items-center justify-center border border-[#7fb6ac]/30">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#9ba9c2] leading-tight">
                Log Monthly Fee
              </h2>
              <p className="text-[11px] text-[#6c7674] font-mono">30-Day Auto Extension • Monster Gym</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#6c7674] hover:text-[#9ba9c2] hover:bg-[#1f282c] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-[#67758d]/20 border border-[#67758d] flex items-center space-x-2 text-[#9ba9c2] text-xs font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#7fb6ac]" />
              <span>{error}</span>
            </div>
          )}

          {/* Member Selector */}
          <div>
            <label className="block text-xs font-mono font-semibold text-[#6c7674] uppercase tracking-wider mb-1.5">
              Select Member
            </label>
            {preselectedMember ? (
              <div className="p-3 bg-[#13191b] border border-[#2a3639] rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#7fb6ac]/15 text-[#7fb6ac] border border-[#7fb6ac]/30 font-bold text-sm flex items-center justify-center">
                    {preselectedMember.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#9ba9c2]">{preselectedMember.full_name}</p>
                    <p className="text-xs text-[#6c7674] font-mono">{preselectedMember.phone}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#182023] text-[#7fb6ac] border border-[#2a3639]">
                  Selected
                </span>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full h-[50px] bg-[#13191b] border border-[#2a3639] rounded-xl px-3.5 text-sm text-[#9ba9c2] focus:outline-none focus:border-[#7fb6ac] transition-colors appearance-none font-sans"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id} className="bg-[#13191b] text-[#9ba9c2]">
                      {m.full_name} ({m.phone}) — {m.status}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#6c7674]">
                  <User className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          {/* Expiry Extension Preview Box */}
          {currentMember && (
            <div className="p-3.5 bg-[#13191b] border border-[#2a3639] rounded-2xl font-mono">
              <p className="text-[10px] font-semibold text-[#6c7674] uppercase tracking-wider mb-2">
                RENEWAL LIFECYCLE PROJECTION
              </p>
              <div className="flex items-center justify-between text-xs">
                <div className="text-left">
                  <span className="text-[#67758d] block text-[10px]">CURRENT EXPIRY</span>
                  <span className="font-bold text-[#9ba9c2] text-sm">
                    {formatDisplayDate(currentMember.expiry_date)}
                  </span>
                </div>
                <div className="flex flex-col items-center px-2">
                  <span className="text-[10px] text-[#7fb6ac] font-bold">+30 DAYS</span>
                  <ArrowRight className="w-4 h-4 text-[#7fb6ac] my-0.5" />
                </div>
                <div className="text-right">
                  <span className="text-[#67758d] block text-[10px]">NEW VALIDITY</span>
                  <span className="font-black text-[#7fb6ac] text-sm">
                    {formatDisplayDate(projectedNewExpiry)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Amount Box (Fixed at PKR 2,500) */}
          <div>
            <label className="block text-xs font-mono font-semibold text-[#6c7674] uppercase tracking-wider mb-1.5">
              Monthly Base Fee
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={formatPKR(BASE_MONTHLY_FEE)}
                className="w-full h-[50px] bg-[#0c1012] border border-[#2a3639] rounded-xl px-3.5 text-base font-mono font-black text-[#7fb6ac] tracking-wide cursor-not-allowed flex items-center"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-medium text-[#6c7674] bg-[#182023] px-2 py-0.5 rounded border border-[#2a3639]">
                Fixed Rate
              </span>
            </div>
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-xs font-mono font-semibold text-[#6c7674] uppercase tracking-wider mb-1.5">
              Collection Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full h-[50px] bg-[#13191b] border border-[#2a3639] rounded-xl px-3.5 text-sm text-[#9ba9c2] focus:outline-none focus:border-[#7fb6ac] font-mono"
              />
              <Calendar className="w-4 h-4 text-[#6c7674] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Payment Channel Selector */}
          <div>
            <label className="block text-xs font-mono font-semibold text-[#6c7674] uppercase tracking-wider mb-1.5">
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
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#7fb6ac]/15 border-[#7fb6ac] text-[#9ba9c2] shadow-sm'
                        : 'bg-[#13191b] border-[#2a3639] text-[#67758d] hover:border-[#6c7674]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-[#9ba9c2]">{ch.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#7fb6ac]" />}
                    </div>
                    <span className="text-[10px] text-[#6c7674] mt-0.5 font-mono">{ch.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reference / Transaction ID */}
          <div>
            <label className="block text-xs font-mono font-semibold text-[#6c7674] uppercase tracking-wider mb-1.5">
              Reference / Note <span className="text-[#67758d] font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., TRX-98231 or Cash Rec #12"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              className="w-full h-[50px] bg-[#13191b] border border-[#2a3639] rounded-xl px-3.5 text-sm text-[#9ba9c2] placeholder-[#6c7674] focus:outline-none focus:border-[#7fb6ac] font-mono"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !currentMember}
              className="w-full h-12 px-4 bg-[#7fb6ac] hover:bg-[#70a59b] active:scale-[0.98] transition-all text-[#0c1012] font-mono font-black rounded-2xl shadow-glow-mint flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wide cursor-pointer"
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
