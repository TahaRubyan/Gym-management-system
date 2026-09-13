import React from 'react';
import { motion } from 'motion/react';
import { Dumbbell, ArrowRight, UserCheck } from 'lucide-react';
import RotatingText from './RotatingText';

interface WelcomeSplashProps {
  onContinue: () => void;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onContinue }) => {
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
            MONSTER GYM
          </span>
        </div>

        <span className="text-[11px] font-semibold text-[#64748B]">
          Owner Portal
        </span>
      </motion.div>

      {/* Center Section: Gym Name & Owner with React Bits Animation */}
      <div className="w-full max-w-sm mx-auto my-auto flex flex-col items-center text-center space-y-5 py-4">
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
            Monster Gym
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
            <UserCheck className="w-4 h-4 text-[#1A3EEA]" />
            <span>Gym Owner & Founder</span>
          </div>

          {/* React Bits RotatingText applied directly to Dastagir Kanth */}
          <div className="flex items-center justify-center py-1.5">
            <RotatingText
              texts={[
                'DASTAGIR KANTH',
                'GYM OWNER',
                'DASTAGIR KANTH',
                'MONSTER GYM',
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
            Tap continue below to enter the dashboard
          </p>
        </motion.div>
      </div>

      {/* 3. PROMINENT MOBILE CONTINUE BUTTON (ALWAYS VISIBLE & PINNED) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full max-w-sm mx-auto pb-4 pt-2 shrink-0 safe-bottom"
      >
        <button
          onClick={onContinue}
          className="w-full h-[54px] rounded-2xl bg-[#1A3EEA] hover:bg-[#1534D8] active:scale-[0.98] transition-all text-white font-bold text-sm tracking-wider flex items-center justify-center space-x-2.5 shadow-glow-blue cursor-pointer"
        >
          <span>CONTINUE TO DASHBOARD</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </motion.div>
    </div>
  );
};
