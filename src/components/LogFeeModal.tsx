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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div
        className="w-full max-w-md bg-white border-t sm:border border-[#EAE2D6] rounded-t-[32px] sm:rounded-3xl shadow-apple-modal overflow-hidden max-h-[92vh] flex flex-col pb-[env(safe-area-inset-bottom,16px)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle indicator (Apple spec: 36px x 4px, radius 2px, centered) */}
        <div className="pt-3 pb-1 flex justify-center bg-white">
          <div className="w-9 h-1 rounded-full bg-[#D1D5DB]" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#EAE2D6] flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8B9A6E]/15 text-[#8B9A6E] flex items-center justify-center border border-[#8B9A6E]/30">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1C221D] leading-tight">
                Log Monthly Fee
              </h2>
              <p className="text-[11px] text-[#5B675E] font-mono">30-Day Auto Extension • Monster Gym</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8E9A90] hover:text-[#1C221D] hover:bg-[#F7F2EB] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 flex items-center space-x-2 text-red-700 text-xs font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Member Selector */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#5B675E] uppercase tracking-wider mb-1.5">
              Select Member
            </label>
            {preselectedMember ? (
              <div className="p-3 bg-[#F7F2EB] border border-[#EAE2D6] rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EEEEEE] text-[#5B675E] border border-[#EAE2D6] font-bold text-sm flex items-center justify-center">
                    {preselectedMember.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1C221D]">{preselectedMember.full_name}</p>
                    <p className="text-xs text-[#5B675E] font-mono">{preselectedMember.phone}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-white text-[#5E6D45] border border-[#EAE2D6]">
                  Selected
                </span>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full h-[50px] bg-white border border-[#EAE2D6] rounded-2xl px-3.5 text-sm text-[#1C221D] focus:outline-none focus:border-[#8B9A6E] transition-colors appearance-none font-sans shadow-sm"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id} className="bg-white text-[#1C221D]">
                      {m.full_name} ({m.phone}) — {m.status}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#8E9A90]">
                  <User className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          {/* Expiry Extension Preview Box */}
          {currentMember && (
            <div className="p-3.5 bg-[#F7F2EB] border border-[#EAE2D6] rounded-2xl font-mono">
              <p className="text-[10px] font-bold text-[#8E9A90] uppercase tracking-wider mb-2">
                RENEWAL LIFECYCLE PROJECTION
              </p>
              <div className="flex items-center justify-between text-xs">
                <div className="text-left">
                  <span className="text-[#8E9A90] block text-[10px]">CURRENT EXPIRY</span>
                  <span className="font-bold text-[#1C221D] text-sm">
                    {formatDisplayDate(currentMember.expiry_date)}
                  </span>
                </div>
                <div className="flex flex-col items-center px-2">
                  <span className="text-[10px] text-[#8B9A6E] font-bold">+30 DAYS</span>
                  <ArrowRight className="w-4 h-4 text-[#8B9A6E] my-0.5" />
                </div>
                <div className="text-right">
                  <span className="text-[#8E9A90] block text-[10px]">NEW VALIDITY</span>
                  <span className="font-black text-[#8B9A6E] text-sm">
                    {formatDisplayDate(projectedNewExpiry)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Amount Box (Fixed at PKR 2,500) */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#5B675E] uppercase tracking-wider mb-1.5">
              Monthly Base Fee
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={formatPKR(BASE_MONTHLY_FEE)}
                className="w-full h-[50px] bg-[#F7F2EB] border border-[#EAE2D6] rounded-2xl px-3.5 text-base font-mono font-black text-[#8B9A6E] tracking-wide cursor-not-allowed flex items-center"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#5B675E] bg-white px-2 py-0.5 rounded-lg border border-[#EAE2D6]">
                Fixed Rate
              </span>
            </div>
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#5B675E] uppercase tracking-wider mb-1.5">
              Collection Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full h-[50px] bg-white border border-[#EAE2D6] rounded-2xl px-3.5 text-sm text-[#1C221D] focus:outline-none focus:border-[#8B9A6E] font-mono shadow-sm"
              />
              <Calendar className="w-4 h-4 text-[#8E9A90] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Payment Channel Selector */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#5B675E] uppercase tracking-wider mb-1.5">
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
                    className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#8B9A6E]/15 border-[#8B9A6E] text-[#1C221D] shadow-sm'
                        : 'bg-[#F7F2EB] border-[#EAE2D6] text-[#5B675E] hover:border-[#8B9A6E]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-[#1C221D]">{ch.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#8B9A6E]" />}
                    </div>
                    <span className="text-[10px] text-[#8E9A90] mt-0.5 font-mono">{ch.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reference / Transaction ID */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#5B675E] uppercase tracking-wider mb-1.5">
              Reference / Note <span className="text-[#8E9A90] font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., TRX-98231 or Cash Rec #12"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              className="w-full h-[50px] bg-white border border-[#EAE2D6] rounded-2xl px-3.5 text-sm text-[#1C221D] placeholder-[#8E9A90] focus:outline-none focus:border-[#8B9A6E] font-mono shadow-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !currentMember}
              className="w-full h-12 px-4 bg-[#8B9A6E] hover:bg-[#7D8C61] active:scale-[0.98] transition-all text-white font-mono font-black rounded-2xl shadow-glow-sage flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wide cursor-pointer"
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
