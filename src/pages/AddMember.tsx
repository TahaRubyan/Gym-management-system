import React, { useState } from 'react';
import {
  UserPlus,
  User,
  Phone,
  Calendar,
  CreditCard,
  FileText,
  Check,
  AlertCircle,
} from 'lucide-react';
import { PaymentChannel } from '../types/gym';
import {
  BASE_MONTHLY_FEE,
  calculateInitialExpiry,
  formatDisplayDate,
  formatPKR,
  getTodayIso,
  isValidPakistaniPhone,
  normalizePakistaniPhone,
} from '../utils/dateAndPhone';
import { registerMemberWithPayment } from '../services/storage';

interface AddMemberProps {
  onSuccess: (memberName: string, totalAmount: number) => void;
  onCancel: () => void;
}

export const AddMember: React.FC<AddMemberProps> = ({ onSuccess, onCancel }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [joiningDate, setJoiningDate] = useState<string>(getTodayIso());
  const [admissionFee, setAdmissionFee] = useState<string>('0');
  const [channel, setChannel] = useState<PaymentChannel>('CASH');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live Calculations
  const numericAdmissionFee = Math.max(0, parseInt(admissionFee, 10) || 0);
  const totalMonth1Fee = numericAdmissionFee + BASE_MONTHLY_FEE;
  const initialExpiryDate = calculateInitialExpiry(joiningDate);

  // Phone Validation Status
  const isPhoneValid = phone.length > 0 ? isValidPakistaniPhone(phone) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Member full name is required.');
      return;
    }

    if (!phone.trim()) {
      setError('Mobile phone number is required.');
      return;
    }

    if (!isValidPakistaniPhone(phone)) {
      setError('Please enter a valid Pakistani mobile number (e.g. 03001234567).');
      return;
    }

    try {
      setIsSubmitting(true);
      const newMember = await registerMemberWithPayment({
        full_name: fullName.trim(),
        phone: normalizePakistaniPhone(phone),
        joined_date: joiningDate,
        admission_fee: numericAdmissionFee,
        channel,
        transaction_ref: transactionRef.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      onSuccess(newMember.full_name, totalMonth1Fee);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to register new member';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const channels: { id: PaymentChannel; label: string; desc: string }[] = [
    { id: 'CASH', label: 'Cash', desc: 'Hand to Hand' },
    { id: 'EASYPAISA', label: 'EasyPaisa', desc: 'Direct Transfer' },
    { id: 'JAZZCASH', label: 'JazzCash', desc: 'Direct Transfer' },
    { id: 'BANK_TRANSFER', label: 'Bank / Raast', desc: 'Online / IBFT' },
  ];

  return (
    <div className="space-y-4 pb-28 px-4 pt-2 max-w-md mx-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#6EE7B7] uppercase tracking-widest">
            REGISTRATION
          </span>
          <h2 className="text-xl font-black text-[#E2E8F0] tracking-tight">Add New Member</h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-mono text-[#94A3B8] hover:text-[#E2E8F0] px-2 py-1"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3.5 rounded-2xl bg-[#EF4444]/15 border border-[#EF4444]/40 flex items-center space-x-2.5 text-[#FCA5A5] text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
            Full Name <span className="text-[#EF4444]">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="e.g. Hamza Tariq"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#0F1522] border border-[#1E2B3E] focus:border-[#10B981] rounded-2xl pl-11 pr-4 py-3 text-sm text-[#E2E8F0] placeholder-[#64748B] focus:outline-none transition-colors"
            />
            <User className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Mobile Phone (Pakistani Format) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider">
              Mobile Phone <span className="text-[#EF4444]">*</span>
            </label>
            {phone.length > 0 && (
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  isPhoneValid
                    ? 'bg-[#10B981]/20 text-[#6EE7B7]'
                    : 'bg-[#EF4444]/20 text-[#FCA5A5]'
                }`}
              >
                {isPhoneValid ? '✓ Valid Pakistani Mobile' : 'Invalid format (03XX)'}
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="tel"
              inputMode="tel"
              required
              placeholder="0300 1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full bg-[#0F1522] border rounded-2xl pl-11 pr-4 py-3 text-sm text-[#E2E8F0] placeholder-[#64748B] focus:outline-none transition-colors ${
                phone.length > 0 && !isPhoneValid
                  ? 'border-[#EF4444]/60 focus:border-[#EF4444]'
                  : 'border-[#1E2B3E] focus:border-[#10B981]'
              }`}
            />
            <Phone className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          <p className="text-[11px] text-[#64748B] mt-1 pl-1 font-mono">
            Accepts 03001234567 or 923001234567. Auto-formatted for WhatsApp.
          </p>
        </div>

        {/* Joining Date */}
        <div>
          <label className="block text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
            Joining Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
              className="w-full bg-[#0F1522] border border-[#1E2B3E] focus:border-[#10B981] rounded-2xl pl-11 pr-4 py-3 text-sm text-[#E2E8F0] focus:outline-none transition-colors font-mono"
            />
            <Calendar className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Fee Configuration Section */}
        <div className="p-4 bg-[#0F1522] border border-[#1E2B3E] rounded-3xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#10B981]" />
              FEE CONFIGURATION
            </span>
            <span className="text-[10px] font-mono text-[#6EE7B7] font-semibold">Month 1 Breakdown</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Admission Fee Input */}
            <div>
              <label className="block text-[10px] font-mono font-semibold text-[#94A3B8] uppercase mb-1">
                Admission Fee
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={admissionFee}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setAdmissionFee(val);
                  }}
                  placeholder="0"
                  className="w-full bg-[#090D15] border border-[#1A2536] focus:border-[#10B981] rounded-xl px-3 py-2 text-sm font-mono font-bold text-[#E2E8F0] focus:outline-none"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#64748B] font-mono">
                  PKR
                </span>
              </div>
              <span className="text-[10px] text-[#64748B] block mt-0.5 font-mono">Default 0 if promo</span>
            </div>

            {/* Base Monthly Fee (Strictly 2500) */}
            <div>
              <label className="block text-[10px] font-mono font-semibold text-[#94A3B8] uppercase mb-1">
                Base Monthly Fee
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value="2,500"
                  className="w-full bg-[#090D15] border border-[#1A2536] rounded-xl px-3 py-2 text-sm font-mono font-bold text-[#6EE7B7] cursor-not-allowed"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#6EE7B7] font-mono">
                  PKR
                </span>
              </div>
              <span className="text-[10px] text-[#64748B] block mt-0.5 font-mono">Fixed rate</span>
            </div>
          </div>

          {/* Month 1 Total Due Display */}
          <div className="p-3.5 bg-gradient-to-r from-[#141E2D] to-[#0F1824] border border-[#10B981]/30 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#94A3B8] block">
                MONTH 1 TOTAL DUE
              </span>
              <span className="text-xs text-[#94A3B8] font-mono">
                Admission ({formatPKR(numericAdmissionFee)}) + Base (PKR 2,500)
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-mono font-black text-[#6EE7B7] block">
                {formatPKR(totalMonth1Fee)}
              </span>
            </div>
          </div>

          {/* Projected Initial Expiry Date */}
          <div className="text-xs text-[#94A3B8] flex items-center justify-between pt-1 font-mono">
            <span>Pass Valid Until (+30 Days):</span>
            <span className="font-bold text-[#E2E8F0]">{formatDisplayDate(initialExpiryDate)}</span>
          </div>
        </div>

        {/* Payment Channel */}
        <div>
          <label className="block text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
            Initial Payment Channel
          </label>
          <div className="grid grid-cols-2 gap-2">
            {channels.map((ch) => {
              const isSelected = channel === ch.id;
              return (
                <button
                  type="button"
                  key={ch.id}
                  onClick={() => setChannel(ch.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#10B981]/15 border-[#10B981] text-[#E2E8F0] shadow-sm shadow-emerald-500/20'
                      : 'bg-[#0F1522] border-[#1E2B3E] text-[#94A3B8] hover:border-[#2A3B54]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-[#E2E8F0]">{ch.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#10B981]" />}
                  </div>
                  <span className="text-[10px] text-[#64748B] mt-0.5 font-mono">{ch.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Transaction Reference (Optional) */}
        <div>
          <label className="block text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
            Transaction Ref / Receipt No. <span className="text-[#64748B] font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. CASH-101 or TRX-092812"
            value={transactionRef}
            onChange={(e) => setTransactionRef(e.target.value)}
            className="w-full bg-[#0F1522] border border-[#1E2B3E] focus:border-[#10B981] rounded-2xl px-4 py-2.5 text-sm text-[#E2E8F0] placeholder-[#64748B] focus:outline-none font-mono"
          />
        </div>

        {/* Notes / Locker ID */}
        <div>
          <label className="block text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
            Notes / Locker ID <span className="text-[#64748B] font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. Locker #22 • Evening regular"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#0F1522] border border-[#1E2B3E] focus:border-[#10B981] rounded-2xl pl-11 pr-4 py-2.5 text-sm text-[#E2E8F0] placeholder-[#64748B] focus:outline-none font-sans"
            />
            <FileText className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Submit CTA Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] hover:brightness-110 active:scale-[0.98] transition-all text-[#E2E8F0] font-black rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 text-sm disabled:opacity-50 font-mono tracking-wide"
          >
            <UserPlus className="w-5 h-5 stroke-[2.5]" />
            <span>
              {isSubmitting
                ? 'Registering Member...'
                : `Register & Collect ${formatPKR(totalMonth1Fee)}`}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
