import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, ArrowRight, ArrowLeft, ShieldCheck, Lock, Delete, CheckCircle2 } from 'lucide-react';
import RotatingText from './RotatingText';
import { getGymSettings } from '../services/storage';

interface WelcomeSplashProps {
  onContinue: () => void;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onContinue }) => {
  const [step, setStep] = useState<'welcome' | 'pin'>('welcome');
  const [pin, setPin] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const settings = getGymSettings();
  const currentPin = settings.securityPin || '1234';
  const gymName = settings.gymName || "MONSTER'S GYM";
  const ownerName = settings.ownerName || 'DASTGIR KANTH';

  const handleKeyPress = useCallback(
    (digit: string) => {
      if (isUnlocked || pin.length >= 4) return;
      setIsError(false);
      setErrorMessage('');

      const newPin = pin + digit;
      setPin(newPin);

      if (newPin.length === 4) {
        if (newPin === currentPin) {
          setIsUnlocked(true);
          setTimeout(() => {
            onContinue();
          }, 450);
        } else {
          setIsError(true);
          setErrorMessage('Incorrect PIN. Please try again.');
          setTimeout(() => {
            setPin('');
            setIsError(false);
          }, 650);
        }
      }
    },
    [pin, isUnlocked, currentPin, onContinue]
  );

  const handleDelete = useCallback(() => {
    if (isUnlocked) return;
    setIsError(false);
    setErrorMessage('');
    setPin((prev) => prev.slice(0, -1));
  }, [isUnlocked]);

  const handleClear = useCallback(() => {
    if (isUnlocked) return;
    setIsError(false);
    setErrorMessage('');
    setPin('');
  }, [isUnlocked]);

  // Handle physical keyboard input on desktop
  useEffect(() => {
    if (step !== 'pin') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setStep('welcome');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, handleKeyPress, handleDelete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#F4F6F9] text-[#0F172A] flex flex-col justify-between p-5 sm:p-6 overflow-y-auto min-h-[100dvh] h-[100dvh] max-h-[100dvh] safe-top safe-bottom select-none">
      {/* Ambient Fintech Palette Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[320px] h-[320px] bg-[#1A3EEA]/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[320px] h-[320px] bg-[#EBF1FF] rounded-full blur-[100px] pointer-events-none" />

      {/* Top Brand Micro Pill */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm mx-auto flex items-center justify-between pt-1 shrink-0"
      >
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-[#E9ECEF] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#1A3EEA] animate-pulse" />
          <span className="text-[11px] font-bold tracking-wider text-[#0F172A] uppercase font-mono">
            {gymName}
          </span>
        </div>

        <span className="text-[11px] font-semibold text-[#64748B]">Owner Portal</span>
      </motion.div>

      {/* Main Content Area: Step 1 (Welcome) or Step 2 (PIN Lock) */}
      <AnimatePresence mode="wait">
        {step === 'welcome' ? (
          <motion.div
            key="step-welcome"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-sm mx-auto my-auto flex flex-col items-center text-center space-y-5 py-4"
          >
            {/* Modern Circular Icon Emblem */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center"
            >
              <div className="w-20 h-20 rounded-[24px] bg-[#1A3EEA] text-white flex items-center justify-center shadow-glow-blue relative z-10">
                <Dumbbell className="w-10 h-10 transform -rotate-45 stroke-[2.2]" />
              </div>
            </motion.div>

            {/* 1. GYM NAME */}
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-4xl font-black tracking-normal text-[#0F172A] leading-tight"
              >
                {gymName}
              </motion.h1>
              <p className="text-sm text-[#64748B] font-medium tracking-wide">
                Management & Membership System
              </p>
            </div>

            {/* 2. OWNER NAME WITH REACT BITS TRANSITION */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="w-full p-5 rounded-[28px] bg-white border border-[#E9ECEF] shadow-apple-card space-y-3"
            >
              <div className="flex items-center justify-center space-x-2 text-xs text-[#64748B] font-semibold tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4 text-[#1A3EEA]" />
                <span>Gym Owner & Founder</span>
              </div>

              {/* React Bits RotatingText applied directly to DASTGIR KANTH */}
              <div className="flex items-center justify-center py-1.5">
                <RotatingText
                  texts={[
                    ownerName,
                    'GYM OWNER',
                    ownerName,
                    gymName,
                  ]}
                  mainClassName="px-4 py-1.5 bg-[#EBF1FF] text-[#1A3EEA] border border-[#1A3EEA]/20 rounded-2xl text-base sm:text-lg font-black tracking-wide justify-center shadow-sm"
                  staggerFrom="first"
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  staggerDuration={0.02}
                  transition={{ type: 'spring', damping: 25, stiffness: 320 }}
                  rotationInterval={2600}
                />
              </div>

              <p className="text-xs text-[#94A3B8] tracking-wide">
                Tap continue to verify owner security PIN
              </p>
            </motion.div>
          </motion.div>
        ) : (
          /* Step 2: 4-Digit PIN Lock Screen */
          <motion.div
            key="step-pin"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-sm mx-auto my-auto flex flex-col items-center text-center space-y-4 py-2"
          >
            {/* Lock Emblem */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={isUnlocked ? { scale: [1, 1.15, 1], rotate: [0, 5, 0] } : { scale: 1 }}
              className="relative flex items-center justify-center"
            >
              <div
                className={`w-16 h-16 rounded-[22px] flex items-center justify-center transition-colors duration-300 shadow-sm ${
                  isUnlocked
                    ? 'bg-emerald-500 text-white shadow-emerald-200'
                    : isError
                    ? 'bg-red-500 text-white'
                    : 'bg-[#1A3EEA] text-white shadow-glow-blue'
                }`}
              >
                {isUnlocked ? (
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                ) : (
                  <Lock className="w-7 h-7 stroke-[2.2]" />
                )}
              </div>
            </motion.div>

            {/* Header copy */}
            <div className="space-y-1">
              <h2 className="text-xl font-black text-[#0F172A] tracking-tight">
                {isUnlocked ? 'Access Granted' : 'Enter Owner PIN'}
              </h2>
              <p className="text-xs text-[#64748B] font-medium">
                {isUnlocked
                  ? 'Welcome, ' + ownerName
                  : '4-digit security PIN required to enter'}
              </p>
            </div>

            {/* 4 Interactive PIN Dots with Shake Animation */}
            <motion.div
              animate={isError ? { x: [-12, 12, -8, 8, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.45 }}
              className="flex items-center justify-center space-x-4 py-2"
            >
              {[0, 1, 2, 3].map((index) => {
                const isFilled = pin.length > index;
                return (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all duration-200 ${
                      isUnlocked
                        ? 'bg-emerald-500 scale-110 shadow-sm'
                        : isError
                        ? 'bg-red-500 scale-105'
                        : isFilled
                        ? 'bg-[#1A3EEA] scale-125 shadow-sm'
                        : 'bg-[#E2E8F0] border border-[#CBD5E1]'
                    }`}
                  />
                );
              })}
            </motion.div>

            {/* Error message or subtle hint */}
            <div className="h-5 flex items-center justify-center">
              {errorMessage ? (
                <span className="text-xs font-bold text-red-600 animate-pulse">
                  {errorMessage}
                </span>
              ) : (
                <span className="text-[11px] text-[#94A3B8]">
                  Default PIN: <strong className="text-[#64748B]">1234</strong>
                </span>
              )}
            </div>

            {/* Numeric Keypad (3x4 Grid) */}
            <div className="w-full grid grid-cols-3 gap-2.5 pt-1 px-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeyPress(digit)}
                  disabled={isUnlocked}
                  className="h-14 rounded-2xl bg-white border border-[#E9ECEF] hover:bg-[#EBF1FF] hover:border-[#1A3EEA]/30 active:scale-95 text-lg font-bold text-[#0F172A] shadow-sm transition-all flex items-center justify-center cursor-pointer select-none"
                >
                  {digit}
                </button>
              ))}

              {/* Clear */}
              <button
                type="button"
                onClick={handleClear}
                disabled={isUnlocked}
                className="h-14 rounded-2xl bg-[#F8FAFC] border border-[#E9ECEF] hover:bg-[#F1F5F9] active:scale-95 text-xs font-bold text-[#64748B] transition-all flex items-center justify-center cursor-pointer select-none"
              >
                Clear
              </button>

              {/* 0 */}
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                disabled={isUnlocked}
                className="h-14 rounded-2xl bg-white border border-[#E9ECEF] hover:bg-[#EBF1FF] hover:border-[#1A3EEA]/30 active:scale-95 text-lg font-bold text-[#0F172A] shadow-sm transition-all flex items-center justify-center cursor-pointer select-none"
              >
                0
              </button>

              {/* Backspace */}
              <button
                type="button"
                onClick={handleDelete}
                disabled={isUnlocked}
                className="h-14 rounded-2xl bg-[#F8FAFC] border border-[#E9ECEF] hover:bg-[#F1F5F9] active:scale-95 text-sm font-bold text-[#64748B] transition-all flex items-center justify-center cursor-pointer select-none"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>

            {/* Back to intro link */}
            <button
              type="button"
              onClick={() => {
                setPin('');
                setIsError(false);
                setStep('welcome');
              }}
              className="text-xs font-bold text-[#64748B] hover:text-[#0F172A] flex items-center space-x-1 pt-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Intro</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Pinned Continue Action for Step 1 */}
      {step === 'welcome' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-sm mx-auto pb-4 pt-2 shrink-0 safe-bottom"
        >
          <button
            onClick={() => setStep('pin')}
            className="w-full h-[54px] rounded-2xl bg-[#1A3EEA] hover:bg-[#1534D8] active:scale-[0.98] transition-all text-white font-bold text-sm tracking-wider flex items-center justify-center space-x-2.5 shadow-glow-blue cursor-pointer"
          >
            <span>CONTINUE TO LOGIN</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
