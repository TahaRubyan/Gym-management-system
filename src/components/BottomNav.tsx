import React from 'react';
import { TrendingUp, Users, Plus, ClockAlert } from 'lucide-react';

export type NavTab = 'dashboard' | 'members' | 'add-member' | 'expiring';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  expiringCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  expiringCount,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-[env(safe-area-inset-bottom,12px)] pt-2 pointer-events-none select-none">
      <nav className="max-w-md mx-auto pointer-events-auto bg-[#0B101D]/92 backdrop-blur-2xl border border-[#1E2B3E] rounded-2xl shadow-floating-nav px-3 py-1.5 flex items-center justify-between">
        {/* Tab 1: Revenue / Dashboard */}
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 active:scale-95 ${
            currentTab === 'dashboard'
              ? 'text-[#6EE7B7]'
              : 'text-[#94A3B8] hover:text-[#E2E8F0]'
          }`}
          aria-label="Revenue Dashboard"
        >
          <div className="relative">
            <TrendingUp
              className={`w-5 h-5 transition-transform duration-200 ${
                currentTab === 'dashboard' ? 'scale-110 text-[#10B981]' : ''
              }`}
            />
            {currentTab === 'dashboard' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1 bg-[#10B981] rounded-full shadow-glow-emerald" />
            )}
          </div>
          <span className="text-[10px] font-mono font-semibold mt-1 tracking-tight">Revenue</span>
        </button>

        {/* Tab 2: Members Directory */}
        <button
          onClick={() => onTabChange('members')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 active:scale-95 ${
            currentTab === 'members'
              ? 'text-[#6EE7B7]'
              : 'text-[#94A3B8] hover:text-[#E2E8F0]'
          }`}
          aria-label="Members Directory"
        >
          <div className="relative">
            <Users
              className={`w-5 h-5 transition-transform duration-200 ${
                currentTab === 'members' ? 'scale-110 text-[#10B981]' : ''
              }`}
            />
            {currentTab === 'members' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1 bg-[#10B981] rounded-full shadow-glow-emerald" />
            )}
          </div>
          <span className="text-[10px] font-mono font-semibold mt-1 tracking-tight">Members</span>
        </button>

        {/* Tab 3: Center Elevated Add Member Button */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            onClick={() => onTabChange('add-member')}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 active:scale-90 border-2 ${
              currentTab === 'add-member'
                ? 'bg-[#10B981] border-[#E2E8F0] text-[#080B11] shadow-emerald-500/40 ring-4 ring-[#10B981]/20'
                : 'bg-gradient-to-tr from-[#10B981] to-[#059669] border-[#1E2B3E] text-[#E2E8F0] shadow-glow-emerald hover:brightness-110'
            }`}
            aria-label="Add Member"
          >
            <Plus
              className={`w-6 h-6 stroke-[2.5] transition-transform duration-200 ${
                currentTab === 'add-member' ? 'rotate-90' : ''
              }`}
            />
          </button>
        </div>

        {/* Tab 4: Expiring Alert List */}
        <button
          onClick={() => onTabChange('expiring')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 active:scale-95 relative ${
            currentTab === 'expiring'
              ? 'text-[#FCD34D]'
              : 'text-[#94A3B8] hover:text-[#E2E8F0]'
          }`}
          aria-label="Expiring Members"
        >
          <div className="relative">
            <ClockAlert
              className={`w-5 h-5 transition-transform duration-200 ${
                currentTab === 'expiring' ? 'scale-110 text-[#F59E0B]' : ''
              }`}
            />
            {expiringCount > 0 && (
              <span className="absolute -top-1 -right-2.5 min-w-[18px] h-[18px] px-1 bg-[#EF4444] text-[#E2E8F0] text-[10px] font-mono font-black rounded-full flex items-center justify-center ring-2 ring-[#0B101D] animate-pulse">
                {expiringCount > 9 ? '9+' : expiringCount}
              </span>
            )}
            {currentTab === 'expiring' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1 bg-[#F59E0B] rounded-full shadow-glow-amber" />
            )}
          </div>
          <span className="text-[10px] font-mono font-semibold mt-1 tracking-tight">Expiring</span>
        </button>
      </nav>
    </div>
  );
};
