import React from 'react';
import { Dumbbell, RefreshCw, Sparkles } from 'lucide-react';
import { resetDatabaseToSeed } from '../services/storage';

interface HeaderProps {
  onResetSeed?: () => void;
  onOpenSplash?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onResetSeed, onOpenSplash }) => {
  const [isResetting, setIsResetting] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header
      className={`sticky top-0 z-30 w-full safe-top select-none transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-2xl border-b border-[#E9ECEF] shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)]'
          : 'bg-[#F4F6F9]/90 backdrop-blur-lg border-b border-transparent'
      }`}
    >
      <div
        className={`max-w-md mx-auto px-4 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'py-2.5' : 'py-3.5'
        }`}
      >
        <div
          onClick={onOpenSplash}
          className="flex items-center space-x-3 cursor-pointer group"
          title="Open Portal Entrance"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#1A3EEA] flex items-center justify-center shadow-sm text-white group-hover:scale-105 transition-transform shrink-0">
            <Dumbbell className="w-5 h-5 transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-extrabold tracking-normal text-[#0F172A] leading-tight">
                Monster Gym
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF1FF] text-[#1A3EEA] tracking-wide">
                PRO
              </span>
            </div>
            <p className="text-xs font-medium text-[#64748B] mt-0.5 tracking-wide group-hover:text-[#0F172A] transition-colors">
              Dastagir Kanth <span className="text-[#94A3B8]">• Owner</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            disabled={isResetting}
            title="Reset to sample data"
            className="w-9 h-9 rounded-full bg-white border border-[#E9ECEF] text-[#64748B] hover:text-[#0F172A] active:scale-95 transition-all flex items-center justify-center shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin text-[#1A3EEA]' : 'text-[#64748B]'}`} />
          </button>

          {onOpenSplash && (
            <button
              onClick={onOpenSplash}
              title="Show Entrance Intro"
              className="w-9 h-9 rounded-full bg-[#111827] text-white hover:bg-black active:scale-95 transition-all flex items-center justify-center shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
