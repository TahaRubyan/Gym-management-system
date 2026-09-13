import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Phone,
  Calendar,
  CreditCard,
  FileText,
  Check,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Users,
  PlusCircle,
} from 'lucide-react';
import { Member, PaymentChannel } from '../types/gym';
import {
  BASE_MONTHLY_FEE,
  calculateInitialExpiry,
  formatDisplayDate,
  formatDisplayPhone,
  formatPKR,
  getTodayIso,
  isValidPakistaniPhone,
  normalizePakistaniPhone,
  buildWhatsAppReminderUrl,
} from '../utils/dateAndPhone';
import { registerMemberWithPayment } from '../services/storage';

interface AddMemberProps {
  onSuccess: (memberName: string, totalAmount: number) => void;
  onCancel: () => void;
}

export const AddMember: React.FC<AddMemberProps> = ({ onSuccess, onCancel }) => {
  // Wizard Phase: 1 = Details, 2 = Amount & Payment, 'success' = Celebration
  const [phase, setPhase] = useState<1 | 2 | 'success'>(1);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [joiningDate, setJoiningDate] = useState<string>(getTodayIso());
  const [admissionFee, setAdmissionFee] = useState<string>('0');
  const [channel, setChannel] = useState<PaymentChannel>('CASH');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Created Member State for Celebration Phase
  const [createdMember, setCreatedMember] = useState<Member | null>(null);
  const [totalCollected, setTotalCollected] = useState<number>(0);

  // Live Calculations
  const numericAdmissionFee = Math.max(0, parseInt(admissionFee, 10) || 0);
  const totalMonth1Fee = numericAdmissionFee + BASE_MONTHLY_FEE;
  const initialExpiryDate = calculateInitialExpiry(joiningDate);

  // Phone Validation Status
  const isPhoneValid = phone.length > 0 ? isValidPakistaniPhone(phone) : null;

  // Phase 1 -> Phase 2 Transition Handler
  const handleProceedToPhase2 = (e: React.FormEvent) => {
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
      setError('Please enter a valid Pakistani mobile number (e.g. 0300 1234567).');
      return;
    }

    setPhase(2);
  };

  // Final Registration Submission Handler
  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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

      setCreatedMember(newMember);
      setTotalCollected(totalMonth1Fee);
      setPhase('success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to register new member';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset to add another member
  const handleResetForm = () => {
    setFullName('');
    setPhone('');
    setJoiningDate(getTodayIso());
    setAdmissionFee('0');
    setChannel('CASH');
    setTransactionRef('');
    setNotes('');
    setCreatedMember(null);
    setTotalCollected(0);
    setError(null);
    setPhase(1);
  };

  const channels: { id: PaymentChannel; label: string; desc: string }[] = [
    { id: 'CASH', label: 'Cash', desc: 'Front Desk Cash' },
    { id: 'EASYPAISA', label: 'EasyPaisa', desc: 'Direct Transfer' },
    { id: 'JAZZCASH', label: 'JazzCash', desc: 'Direct Transfer' },
    { id: 'BANK_TRANSFER', label: 'Bank / Raast', desc: 'Online / IBFT' },
  ];

  return (
    <div className="space-y-4 pb-28 px-4 pt-2 max-w-md mx-auto select-none">
      {/* Top Header & Phase Breadcrumb */}
      {phase !== 'success' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#5E6D45] uppercase tracking-widest">
                MEMBER REGISTRATION
              </span>
              <h2 className="text-xl font-black text-[#1C221D] tracking-tight font-sans">
                {phase === 1 ? 'Phase 1: Customer Details' : 'Phase 2: Fees & Amount'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-mono font-bold text-[#8E9A90] hover:text-[#1C221D] px-2 py-1 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Stepper Indicator Bar */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                phase >= 1 ? 'bg-[#8B9A6E]' : 'bg-[#EAE2D6]'
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                phase >= 2 ? 'bg-[#8B9A6E]' : 'bg-[#EAE2D6]'
              }`}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#8E9A90]">
            <span className={phase === 1 ? 'text-[#8B9A6E] font-bold' : ''}>1. Customer Details</span>
            <span className={phase === 2 ? 'text-[#8B9A6E] font-bold' : ''}>2. Amount & Payment</span>
          </div>
        </div>
      )}

      {/* Global Error Banner */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center space-x-2.5 text-red-700 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* PHASE 1: CUSTOMER DETAILS */}
      <AnimatePresence mode="wait">
        {phase === 1 && (
          <motion.form
            key="phase-1"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleProceedToPhase2}
            className="space-y-4"
          >
            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono font-bold text-[#5B675E] uppercase tracking-wider mb-1.5">
                Full Name <span className="text-[#8B9A6E]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Hamza Tariq"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-[50px] bg-white border border-[#EAE2D6] focus:border-[#8B9A6E] rounded-2xl pl-11 pr-4 text-sm text-[#1C221D] placeholder-[#8E9A90] focus:outline-none transition-colors shadow-apple-card font-sans"
                />
                <User className="w-4 h-4 text-[#8E9A90] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Mobile Phone (Pakistani Format) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono font-bold text-[#5B675E] uppercase tracking-wider">
                  Mobile Phone <span className="text-[#8B9A6E]">*</span>
                </label>
                {phone.length > 0 && (
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      isPhoneValid
                        ? 'bg-[#8B9A6E]/15 text-[#5E6D45]'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}
                  >
                    {isPhoneValid ? '✓ Valid Pakistani Mobile' : 'Use 03XX format'}
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
                  className={`w-full h-[50px] bg-white border rounded-2xl pl-11 pr-4 text-sm text-[#1C221D] placeholder-[#8E9A90] focus:outline-none transition-colors shadow-apple-card font-mono ${
                    phone.length > 0 && !isPhoneValid
                      ? 'border-red-300 focus:border-red-400'
                      : 'border-[#EAE2D6] focus:border-[#8B9A6E]'
                  }`}
                />
                <Phone className="w-4 h-4 text-[#8E9A90] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-[#8E9A90] mt-1 pl-1 font-mono">
                Accepts 03001234567 or 923001234567. Auto-formatted for WhatsApp.
              </p>
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-xs font-mono font-bold text-[#5B675E] uppercase tracking-wider mb-1.5">
                Joining Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full h-[50px] bg-white border border-[#EAE2D6] focus:border-[#8B9A6E] rounded-2xl pl-11 pr-4 text-sm text-[#1C221D] focus:outline-none transition-colors font-mono shadow-apple-card"
                />
                <Calendar className="w-4 h-4 text-[#8E9A90] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Notes / Locker ID */}
            <div>
              <label className="block text-xs font-mono font-bold text-[#5B675E] uppercase tracking-wider mb-1.5">
                Notes / Locker ID <span className="text-[#8E9A90] font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Locker #18 • Morning schedule"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-[50px] bg-white border border-[#EAE2D6] focus:border-[#8B9A6E] rounded-2xl pl-11 pr-4 text-sm text-[#1C221D] placeholder-[#8E9A90] focus:outline-none shadow-apple-card font-sans"
                />
                <FileText className="w-4 h-4 text-[#8E9A90] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Next Step Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-12 px-6 bg-[#8B9A6E] hover:bg-[#7D8C61] active:scale-[0.98] transition-all text-white font-black rounded-2xl shadow-glow-sage flex items-center justify-center space-x-2 text-sm font-mono tracking-wide cursor-pointer"
              >
                <span>NEXT: AMOUNT & PAYMENT</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </motion.form>
        )}

        {/* PHASE 2: AMOUNT (MONTHLY & ADMISSION) & PAYMENT */}
        {phase === 2 && (
          <motion.form
            key="phase-2"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmitRegistration}
            className="space-y-4"
          >
            {/* Member Summary Header */}
            <div className="p-3.5 bg-white border border-[#EAE2D6] rounded-2xl flex items-center justify-between shadow-apple-card">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#8E9A90] font-bold block tracking-wider">
                  NEW CUSTOMER
                </span>
                <span className="text-sm font-bold text-[#1C221D]">{fullName}</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#8B9A6E] bg-[#8B9A6E]/10 px-2.5 py-1 rounded-full border border-[#8B9A6E]/20">
                {formatDisplayPhone(phone)}
              </span>
            </div>

            {/* Amount Breakdown Box */}
            <div className="p-5 bg-white border border-[#EAE2D6] rounded-3xl space-y-4 shadow-apple-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1C221D] flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#8B9A6E]" />
                  FEE CONFIGURATION
                </span>
                <span className="text-[10px] font-mono text-[#8B9A6E] font-bold bg-[#8B9A6E]/10 px-2 py-0.5 rounded-full border border-[#8B9A6E]/20">
                  Month 1 Package
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* 1. Admission Fee Input */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-[#5B675E] uppercase mb-1">
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
                      className="w-full h-[50px] bg-[#EEEEEE]/50 border border-[#EAE2D6] focus:border-[#8B9A6E] focus:bg-white rounded-xl px-3 text-sm font-mono font-bold text-[#1C221D] focus:outline-none focus:ring-2 focus:ring-[#8B9A6E]/20 transition-all"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#8E9A90] font-mono font-bold">
                      PKR
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8E9A90] block mt-1 font-mono">One-off initial fee</span>
                </div>

                {/* 2. Monthly Fee (Strictly 2500) */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-[#5B675E] uppercase mb-1">
                    Monthly Fee
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value="2,500"
                      className="w-full h-[50px] bg-[#EEEEEE] border border-[#EAE2D6] rounded-xl px-3 text-sm font-mono font-bold text-[#8B9A6E] cursor-not-allowed"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#8B9A6E] font-mono font-bold">
                      PKR
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8E9A90] block mt-1 font-mono">Fixed recurring fee</span>
                </div>
              </div>

              {/* Total Due Inflow */}
              <div className="p-4 bg-[#F7F2EB] border border-[#8B9A6E]/30 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#5B675E] block">
                    TOTAL AMOUNT DUE
                  </span>
                  <span className="text-xs text-[#8E9A90] font-mono">
                    Admission ({formatPKR(numericAdmissionFee)}) + Monthly (PKR 2,500)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono font-black text-[#8B9A6E] block">
                    {formatPKR(totalMonth1Fee)}
                  </span>
                </div>
              </div>

              {/* Initial Expiry Date Preview */}
              <div className="text-xs text-[#5B675E] flex items-center justify-between pt-1 font-mono">
                <span>Pass Valid Until (+30 Days):</span>
                <span className="font-bold text-[#1C221D]">{formatDisplayDate(initialExpiryDate)}</span>
              </div>
            </div>

            {/* Payment Channel */}
            <div>
              <label className="block text-xs font-mono font-bold text-[#5B675E] uppercase tracking-wider mb-2">
                Payment Channel
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {channels.map((ch) => {
                  const isSelected = channel === ch.id;
                  return (
                    <button
                      type="button"
                      key={ch.id}
                      onClick={() => setChannel(ch.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#8B9A6E]/15 border-2 border-[#8B9A6E] text-[#1C221D] shadow-sm'
                          : 'bg-white border-[#EAE2D6] text-[#5B675E] hover:border-[#8B9A6E]/50 shadow-apple-card'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-[#1C221D]">{ch.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#8B9A6E] stroke-[2.5]" />}
                      </div>
                      <span className="text-[10px] text-[#8E9A90] mt-1 font-mono">{ch.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Transaction Reference (Optional) */}
            <div>
              <label className="block text-xs font-mono font-bold text-[#5B675E] uppercase tracking-wider mb-1.5">
                Transaction Ref / Receipt No. <span className="text-[#8E9A90] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. CASH-101 or TRX-092812"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full h-[50px] bg-white border border-[#EAE2D6] focus:border-[#8B9A6E] rounded-2xl px-4 text-sm text-[#1C221D] placeholder-[#8E9A90] focus:outline-none focus:ring-2 focus:ring-[#8B9A6E]/20 font-mono shadow-apple-card"
              />
            </div>

            {/* Action Buttons: Back + Submit */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPhase(1)}
                className="h-12 px-4 bg-white hover:bg-[#F7F2EB] border border-[#EAE2D6] text-[#1C221D] font-mono text-xs font-bold rounded-2xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-apple-card"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="col-span-2 h-12 px-4 bg-[#8B9A6E] hover:bg-[#7D8C61] active:scale-[0.98] transition-all text-white font-black rounded-2xl shadow-glow-sage flex items-center justify-center space-x-2 text-xs disabled:opacity-50 font-mono tracking-wide cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>
                  {isSubmitting
                    ? 'Enrolling Member...'
                    : `REGISTER & COLLECT ${formatPKR(totalMonth1Fee)}`}
                </span>
              </button>
            </div>
          </motion.form>
        )}

        {/* COMPLETION PHASE: ANIMATION OF NEW MEMBER ADDED */}
        {phase === 'success' && createdMember && (
          <motion.div
            key="phase-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5 pt-2 text-center"
          >
            {/* Animated Celebration Badge */}
            <div className="relative flex items-center justify-center my-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.25, 1] }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-24 h-24 rounded-full bg-[#8B9A6E]/15 border-2 border-[#8B9A6E] flex items-center justify-center shadow-glow-sage relative z-10"
              >
                <CheckCircle2 className="w-12 h-12 text-[#8B9A6E] stroke-[2.5]" />
              </motion.div>

              {/* Pulsing Aura Rings */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.6, 0], scale: [1, 1.7] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                className="absolute w-24 h-24 rounded-full border border-[#8B9A6E] pointer-events-none"
              />
            </div>

            {/* Success Headline */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-[#8B9A6E] uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8B9A6E]" />
                ENROLLMENT COMPLETE
              </span>
              <h2 className="text-2xl font-black text-[#1C221D] tracking-tight">
                New Member Added!
              </h2>
              <p className="text-xs text-[#5B675E] font-mono">
                {createdMember.full_name} has been enrolled in Monster Gym.
              </p>
            </div>

            {/* Detailed Member Confirmation Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-5 bg-white border border-[#EAE2D6] rounded-3xl text-left space-y-3 shadow-apple-card"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D6]">
                <div>
                  <h3 className="text-base font-bold text-[#1C221D]">{createdMember.full_name}</h3>
                  <p className="text-xs font-mono text-[#5B675E]">
                    {formatDisplayPhone(createdMember.phone)}
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#8B9A6E]/15 text-[#5E6D45] border border-[#8B9A6E]/30 text-[10px] font-mono font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
                <div>
                  <span className="text-[#8E9A90] text-[10px] block font-bold">MONTH 1 COLLECTION</span>
                  <span className="text-sm font-extrabold text-[#8B9A6E]">
                    {formatPKR(totalCollected)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[#8E9A90] text-[10px] block font-bold">PASS VALID UNTIL</span>
                  <span className="text-sm font-extrabold text-[#1C221D]">
                    {formatDisplayDate(createdMember.expiry_date)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#5B675E] pt-2 border-t border-[#EAE2D6]">
                <span>Channel: {channel}</span>
                <span>Base Fee: PKR 2,500</span>
              </div>
            </motion.div>

            {/* Quick Action Strip */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="space-y-2.5 pt-2"
            >
              {/* WhatsApp Welcome Button */}
              <button
                onClick={() => {
                  const url = buildWhatsAppReminderUrl(
                    createdMember.full_name,
                    createdMember.phone,
                    createdMember.expiry_date
                  );
                  window.open(url, '_blank');
                }}
                className="w-full h-12 px-4 rounded-2xl bg-[#8B9A6E]/15 hover:bg-[#8B9A6E]/25 border border-[#8B9A6E]/40 text-[#5E6D45] font-mono font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-[#8B9A6E]" />
                <span>SEND WHATSAPP WELCOME</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* View in Roster */}
                <button
                  onClick={() => onSuccess(createdMember.full_name, totalCollected)}
                  className="h-12 px-3 rounded-2xl bg-[#8B9A6E] hover:bg-[#7D8C61] text-white font-mono font-bold text-xs flex items-center justify-center space-x-1.5 transition-all active:scale-95 shadow-glow-sage cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>VIEW ROSTER</span>
                </button>

                {/* Add Another Member */}
                <button
                  onClick={handleResetForm}
                  className="h-12 px-3 rounded-2xl bg-white hover:bg-[#F7F2EB] border border-[#EAE2D6] text-[#1C221D] font-mono font-bold text-xs flex items-center justify-center space-x-1.5 transition-all active:scale-95 cursor-pointer shadow-apple-card"
                >
                  <PlusCircle className="w-4 h-4 text-[#8B9A6E]" />
                  <span>ADD ANOTHER</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
