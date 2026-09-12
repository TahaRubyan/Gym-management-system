import React from 'react';
import { Dumbbell, Shield, RefreshCw, Sparkles } from 'lucide-react';
import { resetDatabaseToSeed } from '../services/storage';

interface HeaderProps {
  onResetSeed?: () => void;
  onOpenSplash?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onResetSeed, onOpenSplash }) => {
  const [isResetting, setIsResetting] = React.useState(false);

  const handleReset = async () => {
    if (window.confirm('Reset demo database with sample members and payments?')) {
      try {
        setIsResetting(true);
        await resetDatabaseToSeed();
        onResetSeed?.();
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0c1012]/92 backdrop-blur-xl border-b border-[#2a3639] safe-top select-none">
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
        <div
          onClick={onOpenSplash}
          className="flex items-center space-x-3 cursor-pointer group"
          title="Open Executive Entrance"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#182023] flex items-center justify-center shadow-glow-mint border border-[#7fb6ac]/40 group-hover:scale-105 transition-transform">
            <Dumbbell className="w-5 h-5 text-[#7fb6ac] transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-black tracking-[0.14em] uppercase text-[#9ba9c2] leading-none">
                Monster Gym
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#7fb6ac]/15 text-[#7fb6ac] border border-[#7fb6ac]/30">
                PRO
              </span>
            </div>
            <div className="flex items-center space-x-1 mt-0.5">
              <Shield className="w-3.5 h-3.5 text-[#7fb6ac]" />
              <p className="text-xs font-mono font-medium text-[#6c7674] group-hover:text-[#9ba9c2] transition-colors">
                Dastagir Kanth <span className="text-[#67758d]">• Owner</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenSplash && (
            <button
              onClick={onOpenSplash}
              title="Show Entrance Intro"
              className="p-2 rounded-xl bg-[#182023] border border-[#2a3639] text-[#9ba9c2] hover:text-[#7fb6ac] hover:border-[#7fb6ac]/40 active:scale-95 transition-all text-xs flex items-center gap-1 font-mono cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7fb6ac]" />
            </button>
          )}

          <button
            onClick={handleReset}
            disabled={isResetting}
            title="Reset to sample data"
            className="p-2 rounded-xl bg-[#182023] border border-[#2a3639] text-[#9ba9c2] hover:text-[#7fb6ac] hover:border-[#7fb6ac]/40 active:scale-95 transition-all text-xs flex items-center gap-1 font-mono cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-[#7fb6ac]' : ''}`} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
