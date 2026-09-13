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
    <header className="sticky top-0 z-30 w-full bg-[#F7F2EB]/85 backdrop-blur-xl border-b border-[#EAE2D6] safe-top select-none">
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
        <div
          onClick={onOpenSplash}
          className="flex items-center space-x-3 cursor-pointer group"
          title="Open Executive Entrance"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#FFFFFF] flex items-center justify-center shadow-apple-card border border-[#EAE2D6] group-hover:scale-105 transition-transform">
            <Dumbbell className="w-5 h-5 text-[#8B9A6E] transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-black tracking-[0.14em] uppercase text-[#1C221D] leading-none">
                Monster Gym
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#8B9A6E]/15 text-[#5E6D45] border border-[#8B9A6E]/30">
                PRO
              </span>
            </div>
            <div className="flex items-center space-x-1 mt-0.5">
              <Shield className="w-3.5 h-3.5 text-[#8B9A6E]" />
              <p className="text-xs font-mono font-medium text-[#5B675E] group-hover:text-[#1C221D] transition-colors">
                Dastagir Kanth <span className="text-[#8E9A90]">• Owner</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenSplash && (
            <button
              onClick={onOpenSplash}
              title="Show Entrance Intro"
              className="p-2 rounded-xl bg-[#FFFFFF] border border-[#EAE2D6] text-[#5B675E] hover:text-[#1C221D] hover:border-[#8B9A6E]/40 active:scale-95 transition-all text-xs flex items-center gap-1 font-mono shadow-apple-card cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8B9A6E]" />
            </button>
          )}

          <button
            onClick={handleReset}
            disabled={isResetting}
            title="Reset to sample data"
            className="p-2 rounded-xl bg-[#FFFFFF] border border-[#EAE2D6] text-[#5B675E] hover:text-[#1C221D] hover:border-[#8B9A6E]/40 active:scale-95 transition-all text-xs flex items-center gap-1 font-mono shadow-apple-card cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-[#8B9A6E]' : 'text-[#8B9A6E]'}`} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
