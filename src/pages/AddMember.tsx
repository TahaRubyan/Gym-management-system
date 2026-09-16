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
  buildWhatsAppWelcomeUrl,
} from '../utils/dateAndPhone';
import { registerMemberWithPayment, getGymSettings } from '../services/storage';
import { LivePhotoCapture } from '../components/LivePhotoCapture';

interface AddMemberProps {
  onSuccess: (memberName: string, totalAmount: number) => void;
  onCancel: () => void;
}

export const AddMember: React.FC<AddMemberProps> = ({ onSuccess, onCancel }) => {
  const settings = getGymSettings();
  const baseFee = settings.monthlyFee || BASE_MONTHLY_FEE;

  // Wizard Phase: 1 = Details, 2 = Amount & Payment, 'success' = Celebration
  const [phase, setPhase] = useState<1 | 2 | 'success'>(1);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [joiningDate, setJoiningDate] = useState<string>(getTodayIso());
  const [admissionFee, setAdmissionFee] = useState<string>(String(settings.defaultAdmissionFee || 0));
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
  const totalMonth1Fee = numericAdmissionFee + baseFee;
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
        photo_url: photoUrl,
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
    setPhotoUrl(undefined);
    setJoiningDate(getTodayIso());
    setAdmissionFee(String(settings.defaultAdmissionFee || 0));
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
              <span className="text-[10px] font-bold text-[#1A3EEA] uppercase tracking-widest">
                MEMBER REGISTRATION
              </span>
              <h2 className="text-xl font-black text-[#0F172A] tracking-tight">
                {phase === 1 ? 'Phase 1: Customer Details' : 'Phase 2: Fees & Amount'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-bold text-[#94A3B8] hover:text-[#0F172A] px-2 py-1 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Stepper Indicator Bar */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                phase >= 1 ? 'bg-[#1A3EEA]' : 'bg-[#E9ECEF]'
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                phase >= 2 ? 'bg-[#1A3EEA]' : 'bg-[#E9ECEF]'
              }`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-medium text-[#94A3B8]">
            <span className={phase === 1 ? 'text-[#1A3EEA] font-bold' : ''}>1. Customer Details</span>
            <span className={phase === 2 ? 'text-[#1A3EEA] font-bold' : ''}>2. Amount & Payment</span>
          </div>
        </div>
      )}

      {/* Global Error Banner */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center space-x-2.5 text-red-700 text-xs">
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
            className="space-y-4 sm:space-y-5"
          >
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                Full Name <span className="text-[#1A3EEA]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Hamza Tariq"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-[52px] bg-white border border-[#E9ECEF] focus:border-[#1A3EEA] rounded-2xl pl-12 pr-4 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none transition-colors shadow-apple-card font-sans tracking-wide"
                />
                <User className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Mobile Phone (Pakistani Format) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider">
                  Mobile Phone <span className="text-[#1A3EEA]">*</span>
                </label>
                {phone.length > 0 && (
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide ${
                      isPhoneValid
                        ? 'bg-[#EBF1FF] text-[#1A3EEA]'
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
                  className={`w-full h-[52px] bg-white border rounded-2xl pl-12 pr-4 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none transition-colors shadow-apple-card font-mono tracking-wider ${
                    phone.length > 0 && !isPhoneValid
                      ? 'border-red-300 focus:border-red-400'
                      : 'border-[#E9ECEF] focus:border-[#1A3EEA]'
                  }`}
                />
                <Phone className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-xs text-[#94A3B8] mt-1.5 pl-1 tracking-wide">
                Accepts 03001234567 or 923001234567. Auto-formatted for WhatsApp.
              </p>
            </div>

            {/* Live Member Photo Capture */}
            <LivePhotoCapture
              photoUrl={photoUrl}
              onPhotoCaptured={setPhotoUrl}
            />

            {/* Joining Date */}
            <div>
              <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                Joining Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full h-[52px] bg-white border border-[#E9ECEF] focus:border-[#1A3EEA] rounded-2xl pl-12 pr-4 text-sm text-[#0F172A] focus:outline-none transition-colors shadow-apple-card font-sans tracking-wide"
                />
                <Calendar className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                Notes <span className="text-[#94A3B8] font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Morning schedule • Weight training"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-[52px] bg-white border border-[#E9ECEF] focus:border-[#1A3EEA] rounded-2xl pl-12 pr-4 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none shadow-apple-card font-sans tracking-wide"
                />
                <FileText className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Next Step Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full h-[52px] px-6 bg-[#1A3EEA] hover:bg-[#1534D8] active:scale-[0.98] transition-all text-white font-bold rounded-2xl shadow-glow-blue flex items-center justify-center space-x-2.5 text-sm tracking-wider cursor-pointer"
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
            <div className="p-3.5 bg-white border border-[#E9ECEF] rounded-2xl flex items-center justify-between shadow-apple-card">
              <div className="flex items-center space-x-3">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={fullName}
                    className="w-10 h-10 rounded-2xl object-cover border border-[#E9ECEF] shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-2xl bg-[#EBF1FF] text-[#1A3EEA] font-bold text-sm flex items-center justify-center">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#64748B] font-bold block tracking-wider">
                    NEW CUSTOMER
                  </span>
                  <span className="text-sm font-bold text-[#0F172A]">{fullName}</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#1A3EEA] bg-[#EBF1FF] px-2.5 py-1 rounded-full border border-[#1A3EEA]/20">
                {formatDisplayPhone(phone)}
              </span>
            </div>

            {/* Amount Breakdown Box */}
            <div className="p-5 bg-white border border-[#E9ECEF] rounded-3xl space-y-4 shadow-apple-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#1A3EEA]" />
                  FEE CONFIGURATION
                </span>
                <span className="text-[10px] font-mono text-[#1A3EEA] font-bold bg-[#EBF1FF] px-2.5 py-0.5 rounded-full border border-[#1A3EEA]/20">
                  Month 1 Package
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* 1. Admission Fee Input */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-[#64748B] uppercase mb-1">
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
                      className="w-full h-[50px] bg-[#F8FAFC] border border-[#E9ECEF] focus:border-[#1A3EEA] focus:bg-white rounded-xl px-3 text-sm font-mono font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1A3EEA]/20 transition-all"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#94A3B8] font-mono font-bold">
                      PKR
                    </span>
                  </div>
                  <span className="text-[10px] text-[#64748B] block mt-1 font-mono">One-off initial fee</span>
                </div>

                {/* 2. Monthly Fee (Strictly 2500) */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-[#64748B] uppercase mb-1">
                    Monthly Fee
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value="2,500"
                      className="w-full h-[50px] bg-[#F8FAFC] border border-[#E9ECEF] rounded-xl px-3 text-sm font-mono font-bold text-[#1A3EEA] cursor-not-allowed"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#1A3EEA] font-mono font-bold">
                      PKR
                    </span>
                  </div>
                  <span className="text-[10px] text-[#64748B] block mt-1 font-mono">Fixed recurring fee</span>
                </div>
              </div>

              {/* Total Due Inflow */}
              <div className="p-4 sm:p-5 bg-[#F8FAFC] border border-[#1A3EEA]/20 rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase font-bold text-[#64748B] block tracking-wide">
                    TOTAL AMOUNT DUE
                  </span>
                  <span className="text-xs text-[#64748B] font-mono tracking-wide">
                    Admission ({formatPKR(numericAdmissionFee)}) + Monthly (PKR 2,500)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-black text-[#1A3EEA] block">
                    {formatPKR(totalMonth1Fee)}
                  </span>
                </div>
              </div>

              {/* Initial Expiry Date Preview */}
              <div className="text-xs text-[#64748B] flex items-center justify-between pt-1 font-mono tracking-wide">
                <span>Pass Valid Until (+30 Days):</span>
                <span className="font-bold text-[#0F172A]">{formatDisplayDate(initialExpiryDate)}</span>
              </div>
            </div>

            {/* Payment Channel */}
            <div>
              <label className="block text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider mb-2">
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
                          ? 'bg-[#EBF1FF] border-2 border-[#1A3EEA] text-[#0F172A] shadow-sm'
                          : 'bg-white border-[#E9ECEF] text-[#64748B] hover:border-[#1A3EEA]/40 shadow-apple-card'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-[#0F172A] tracking-wide">{ch.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#1A3EEA] stroke-[2.5]" />}
                      </div>
                      <span className="text-[10px] text-[#64748B] mt-1 font-mono">{ch.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Transaction Reference (Optional) */}
            <div>
              <label className="block text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider mb-2">
                Transaction Ref / Receipt No. <span className="text-[#94A3B8] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. CASH-101 or TRX-092812"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full h-[52px] bg-white border border-[#E9ECEF] focus:border-[#1A3EEA] rounded-2xl px-4 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1A3EEA]/20 font-mono shadow-apple-card tracking-wide"
              />
            </div>

            {/* Action Buttons: Back + Submit */}
            <div className="grid grid-cols-3 gap-3 pt-3">
              <button
                type="button"
                onClick={() => setPhase(1)}
                className="h-[52px] px-4 bg-white hover:bg-[#F8FAFC] border border-[#E9ECEF] text-[#0F172A] font-mono text-xs font-bold rounded-2xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-apple-card tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="col-span-2 h-[52px] px-4 bg-[#1A3EEA] hover:bg-[#1534D8] active:scale-[0.98] transition-all text-white font-black rounded-2xl shadow-glow-blue flex items-center justify-center space-x-2 text-xs disabled:opacity-50 font-mono tracking-wider cursor-pointer"
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
                className="w-24 h-24 rounded-full bg-[#EBF1FF] border-2 border-[#1A3EEA] flex items-center justify-center shadow-glow-blue relative z-10"
              >
                <CheckCircle2 className="w-12 h-12 text-[#1A3EEA] stroke-[2.5]" />
              </motion.div>

              {/* Pulsing Aura Rings */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.6, 0], scale: [1, 1.7] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                className="absolute w-24 h-24 rounded-full border border-[#1A3EEA] pointer-events-none"
              />
            </div>

            {/* Success Headline */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#1A3EEA] uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#1A3EEA]" />
                ENROLLMENT COMPLETE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-normal">
                New Member Added!
              </h2>
              <p className="text-sm text-[#64748B] font-medium tracking-wide">
                {createdMember.full_name} has been enrolled in {settings.gymName || "MONSTER'S GYM"}.
              </p>
            </div>

            {/* Detailed Member Confirmation Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-5 sm:p-6 bg-white border border-[#E9ECEF] rounded-[28px] text-left space-y-3.5 shadow-apple-card"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E9ECEF]">
                <div className="flex items-center space-x-3">
                  {createdMember.photo_url ? (
                    <img
                      src={createdMember.photo_url}
                      alt={createdMember.full_name}
                      className="w-12 h-12 rounded-2xl object-cover border border-[#E9ECEF] shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-[#EBF1FF] text-[#1A3EEA] font-black text-base flex items-center justify-center">
                      {createdMember.full_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A] tracking-normal">{createdMember.full_name}</h3>
                    <p className="text-xs font-mono text-[#64748B] mt-0.5 tracking-wider">
                      {formatDisplayPhone(createdMember.phone)}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#EBF1FF] text-[#1A3EEA] border border-[#1A3EEA]/30 text-xs font-bold tracking-wide">
                  ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
                <div>
                  <span className="text-[#64748B] text-[10px] block font-bold tracking-wider">MONTH 1 COLLECTION</span>
                  <span className="text-base font-black text-[#1A3EEA] tracking-wide">
                    {formatPKR(totalCollected)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[#64748B] text-[10px] block font-bold tracking-wider">PASS VALID UNTIL</span>
                  <span className="text-base font-black text-[#0F172A] tracking-wide">
                    {formatDisplayDate(createdMember.expiry_date)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#64748B] pt-2.5 border-t border-[#E9ECEF] tracking-wide">
                <span>Channel: {channel}</span>
                <span>Base Fee: {formatPKR(baseFee)}</span>
              </div>
            </motion.div>

            {/* Quick Action Strip */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="space-y-3 pt-2"
            >
              {/* WhatsApp Welcome Button */}
              <button
                onClick={() => {
                  const url = buildWhatsAppWelcomeUrl(
                    createdMember.full_name,
                    createdMember.phone,
                    createdMember.expiry_date,
                    settings.welcomeTemplate,
                    settings.gymName,
                    settings.ownerName,
                    baseFee
                  );
                  window.open(url, '_blank');
                }}
                className="w-full h-[52px] px-4 rounded-2xl bg-[#EBF1FF] hover:bg-[#EBF1FF]/80 border border-[#1A3EEA]/30 text-[#1A3EEA] font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer shadow-sm tracking-wider"
              >
                <MessageSquare className="w-4 h-4 text-[#1A3EEA]" />
                <span>SEND WHATSAPP WELCOME</span>
              </button>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* View in Roster */}
                <button
                  onClick={() => onSuccess(createdMember.full_name, totalCollected)}
                  className="h-[50px] px-3 rounded-2xl bg-[#1A3EEA] hover:bg-[#1534D8] text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-glow-blue cursor-pointer tracking-wider"
                >
                  <Users className="w-4 h-4" />
                  <span>VIEW ROSTER</span>
                </button>

                {/* Add Another Member */}
                <button
                  onClick={handleResetForm}
                  className="h-[50px] px-3 rounded-2xl bg-white hover:bg-[#F8FAFC] border border-[#E9ECEF] text-[#0F172A] font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer shadow-apple-card tracking-wider"
                >
                  <PlusCircle className="w-4 h-4 text-[#1A3EEA]" />
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
