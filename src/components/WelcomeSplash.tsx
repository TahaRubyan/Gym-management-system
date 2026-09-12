import React from 'react';
import { motion } from 'motion/react';
import { Dumbbell, ArrowRight, Shield } from 'lucide-react';
import RotatingText from './RotatingText';

interface WelcomeSplashProps {
  onContinue: () => void;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onContinue }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0c1012] text-[#9ba9c2] flex flex-col justify-between p-6 overflow-hidden safe-top safe-bottom select-none">
      {/* Ambient Palette Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[360px] h-[360px] bg-[#7fb6ac]/12 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[360px] h-[360px] bg-[#67758d]/15 rounded-full blur-[110px] pointer-events-none" />

      {/* Top Brand Micro Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm mx-auto flex items-center justify-between pt-2"
      >
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-[#182023] border border-[#2a3639]">
          <span className="w-2 h-2 rounded-full bg-[#7fb6ac] animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest text-[#9ba9c2] uppercase">
            MONSTER GYM OS
          </span>
        </div>

        <span className="text-[11px] font-mono text-[#6c7674]">
          OFFLINE READY
        </span>
      </motion.div>

      {/* Center Hero: Gym Name & Owner Name */}
      <div className="w-full max-w-sm mx-auto my-auto flex flex-col items-center text-center space-y-6">
        {/* Animated Brand Emblem */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center"
        >
          {/* Subtle Orbit Ring */}
          <div className="absolute w-24 h-24 rounded-full border border-dashed border-[#7fb6ac]/30 animate-spin" style={{ animationDuration: '30s' }} />

          {/* Core Emblem Badge */}
          <div className="w-20 h-20 rounded-3xl bg-[#182023] border border-[#7fb6ac]/40 flex items-center justify-center shadow-glow-mint relative z-10">
            <Dumbbell className="w-9 h-9 text-[#7fb6ac] transform -rotate-45" />
          </div>
        </motion.div>

        {/* 1. GYM NAME */}
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-3xl sm:text-4xl font-black tracking-[0.18em] uppercase text-[#9ba9c2] font-sans"
          >
            MONSTER GYM
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center justify-center"
          >
            <RotatingText
              texts={[
                'HIGH-PERFORMANCE CLUB',
                'EXECUTIVE MANAGEMENT',
                'TELEMETRY & DISPATCH',
                'OFFLINE PERSISTENCE',
              ]}
              mainClassName="px-3 py-1 bg-[#182023] text-[#7fb6ac] border border-[#7fb6ac]/30 rounded-full text-xs font-mono tracking-wider justify-center"
              staggerFrom="last"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-120%', opacity: 0 }}
              staggerDuration={0.02}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              rotationInterval={2600}
            />
          </motion.div>
        </div>

        {/* 2. OWNER NAME */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="w-full p-4 rounded-2xl bg-[#182023] border border-[#2a3639] shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#7fb6ac] to-transparent" />

          <span className="text-[10px] font-mono tracking-widest uppercase text-[#6c7674] block">
            OWNER & ADMINISTRATOR
          </span>

          <div className="flex items-center justify-center space-x-2 my-1.5">
            <Shield className="w-5 h-5 text-[#7fb6ac]" />
            <h2 className="text-xl font-extrabold tracking-wider uppercase text-[#9ba9c2]">
              DASTAGIR KANTH
            </h2>
          </div>

          <p className="text-xs text-[#67758d] font-mono">
            Authorized Master Control • Monster Gym
          </p>
        </motion.div>
      </div>

      {/* 3. CONTINUE BUTTON */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="w-full max-w-sm mx-auto pb-4"
      >
        <button
          onClick={onContinue}
          className="group w-full py-4 px-6 rounded-2xl bg-[#7fb6ac] hover:bg-[#70a59b] active:scale-[0.98] transition-all duration-200 text-[#0c1012] font-black text-sm tracking-wider uppercase flex items-center justify-center space-x-2.5 shadow-glow-mint border border-[#7fb6ac]/40 cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[2.5]" />
        </button>
        <p className="text-[11px] text-[#6c7674] text-center mt-2.5 font-mono">
          Touch Continue to enter management console
        </p>
      </motion.div>
    </div>
  );
};
