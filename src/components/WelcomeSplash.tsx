import React from 'react';
import { motion } from 'motion/react';
import { Dumbbell, ShieldCheck, ArrowRight, Zap, Database, Lock } from 'lucide-react';
import RotatingText from './RotatingText';

interface WelcomeSplashProps {
  onContinue: () => void;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onContinue }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#080B11] text-[#CBD5E1] flex flex-col justify-between p-6 overflow-hidden safe-top safe-bottom select-none">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[380px] h-[380px] bg-[#10B981]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[380px] h-[380px] bg-[#F59E0B]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#0E1726]/60 rounded-full blur-[90px] pointer-events-none" />

      {/* Top Telemetry Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-sm mx-auto flex items-center justify-between pt-2"
      >
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-[#141B2B]/80 border border-[#223048] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest text-[#94A3B8] uppercase">
            ENTERPRISE OS • V2.4
          </span>
        </div>

        <div className="flex items-center space-x-1.5 text-[11px] font-medium text-[#64748B]">
          <Lock className="w-3.5 h-3.5 text-[#10B981]" />
          <span>OFFLINE SYNC</span>
        </div>
      </motion.div>

      {/* Center Showcase: Monster Gym & Dastagir Kanth */}
      <div className="w-full max-w-sm mx-auto my-auto flex flex-col items-center text-center space-y-6">
        {/* Animated Brand Emblem with Orbital Halo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center"
        >
          {/* Outer Pulsing Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute w-28 h-28 rounded-full border border-dashed border-[#10B981]/30 pointer-events-none"
          />

          {/* Glowing Aura Badge */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#141F1A] via-[#162721] to-[#141923] border border-[#10B981]/40 flex items-center justify-center shadow-2xl shadow-emerald-500/20 relative z-10">
            <Dumbbell className="w-10 h-10 text-[#10B981] transform -rotate-45 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
          </div>
        </motion.div>

        {/* Brand Name with React Bits Rotating Tagline */}
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl font-black tracking-[0.18em] uppercase text-[#E2E8F0] font-sans"
          >
            MONSTER GYM
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center"
          >
            <RotatingText
              texts={[
                'EXCLUSIVE ATHLETIC CLUB',
                'HIGH-PERFORMANCE SYSTEM',
                'REVENUE & TELEMETRY ENGINE',
                'DASTAGIR KANTH EDITION',
              ]}
              mainClassName="px-3 py-1 bg-[#10B981]/15 text-[#6EE7B7] border border-[#10B981]/30 rounded-full text-xs font-mono tracking-wider justify-center"
              staggerFrom="last"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-120%', opacity: 0 }}
              staggerDuration={0.02}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              rotationInterval={2400}
            />
          </motion.div>
        </div>

        {/* Owner Credential Plate: DASTAGIR KANTH */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="w-full p-4 rounded-2xl bg-gradient-to-b from-[#111827]/90 to-[#0F1420]/90 border border-[#1F293D] shadow-xl backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#10B981]/50 to-transparent" />

          <span className="text-[10px] font-mono tracking-widest uppercase text-[#94A3B8] block">
            FOUNDER & SOLE PROPRIETOR
          </span>

          <div className="flex items-center justify-center space-x-2 my-1.5">
            <ShieldCheck className="w-5 h-5 text-[#10B981]" />
            <h2 className="text-xl font-extrabold tracking-wider uppercase text-[#E2E8F0]">
              DASTAGIR KANTH
            </h2>
          </div>

          <p className="text-xs text-[#64748B]">
            Sole Administrator • Master Access Granted
          </p>

          {/* Micro Telemetry Indicators */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#1F293D]/80 text-[10px] font-mono">
            <div className="flex flex-col items-center">
              <Database className="w-3.5 h-3.5 text-[#10B981] mb-1" />
              <span className="text-[#94A3B8]">DEXIE DB</span>
              <span className="text-[#475569]">Encrypted</span>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-3.5 h-3.5 text-[#F59E0B] mb-1" />
              <span className="text-[#94A3B8]">FEE CYCLE</span>
              <span className="text-[#475569]">PKR 2,500</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-2 h-2 rounded-full bg-[#10B981] mt-1 mb-1.5" />
              <span className="text-[#94A3B8]">EXPIRY RADAR</span>
              <span className="text-[#475569]">48-Hour</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom CTA: Continue to Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="w-full max-w-sm mx-auto pb-4"
      >
        <button
          onClick={onContinue}
          className="group w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] hover:brightness-110 active:scale-[0.98] transition-all duration-200 text-[#E2E8F0] font-black text-sm tracking-wider uppercase flex items-center justify-center space-x-3 shadow-xl shadow-emerald-500/25 border border-emerald-400/30 cursor-pointer"
        >
          <span>ENTER MANAGEMENT CONSOLE</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[2.5]" />
        </button>
        <p className="text-[11px] text-[#64748B] text-center mt-2 font-mono">
          Single-Tenant PWA • Authorized Device
        </p>
      </motion.div>
    </div>
  );
};
