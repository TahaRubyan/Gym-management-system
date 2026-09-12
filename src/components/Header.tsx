import React from 'react';
import { Dumbbell, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';
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
    <header className="sticky top-0 z-30 w-full bg-[#080B11]/92 backdrop-blur-xl border-b border-[#1E2B3E] safe-top select-none">
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
        <div
          onClick={onOpenSplash}
          className="flex items-center space-x-3 cursor-pointer group"
          title="Open Executive Credentials"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#12231A] via-[#162D22] to-[#101724] flex items-center justify-center shadow-lg shadow-emerald-500/15 border border-[#10B981]/40 group-hover:scale-105 transition-transform">
            <Dumbbell className="w-5 h-5 text-[#10B981] transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-black tracking-[0.14em] uppercase text-[#E2E8F0] leading-none">
                Monster Gym
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#10B981]/15 text-[#6EE7B7] border border-[#10B981]/30">
                ENTERPRISE
              </span>
            </div>
            <div className="flex items-center space-x-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <p className="text-xs font-mono font-medium text-[#94A3B8] group-hover:text-[#CBD5E1] transition-colors">
                Dastagir Kanth <span className="text-[#64748B]">• Owner</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenSplash && (
            <button
              onClick={onOpenSplash}
              title="Show Splash Intro"
              className="p-2 rounded-xl bg-[#0F1522] border border-[#1E2B3E] text-[#94A3B8] hover:text-[#E2E8F0] hover:border-[#10B981]/40 active:scale-95 transition-all text-xs flex items-center gap-1 font-mono"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
            </button>
          )}

          <button
            onClick={handleReset}
            disabled={isResetting}
            title="Reset to sample data"
            className="p-2 rounded-xl bg-[#0F1522] border border-[#1E2B3E] text-[#94A3B8] hover:text-[#E2E8F0] hover:border-[#10B981]/40 active:scale-95 transition-all text-xs flex items-center gap-1 font-mono"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-[#10B981]' : ''}`} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
