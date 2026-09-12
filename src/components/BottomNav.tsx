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
      <nav className="max-w-md mx-auto pointer-events-auto bg-[#13191b]/95 backdrop-blur-2xl border border-[#2a3639] rounded-2xl shadow-floating-nav px-3 py-1.5 flex items-center justify-between">
        {/* Tab 1: Revenue / Dashboard */}
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 active:scale-95 ${
            currentTab === 'dashboard'
              ? 'text-[#7fb6ac]'
              : 'text-[#67758d] hover:text-[#9ba9c2]'
          }`}
          aria-label="Revenue Dashboard"
        >
          <div className="relative">
            <TrendingUp
              className={`w-5 h-5 transition-transform duration-200 ${
                currentTab === 'dashboard' ? 'scale-110 text-[#7fb6ac]' : ''
              }`}
            />
            {currentTab === 'dashboard' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1 bg-[#7fb6ac] rounded-full shadow-glow-mint" />
            )}
          </div>
          <span className="text-[10px] font-mono font-semibold mt-1 tracking-tight">Revenue</span>
        </button>

        {/* Tab 2: Members Directory */}
        <button
          onClick={() => onTabChange('members')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 active:scale-95 ${
            currentTab === 'members'
              ? 'text-[#7fb6ac]'
              : 'text-[#67758d] hover:text-[#9ba9c2]'
          }`}
          aria-label="Members Directory"
        >
          <div className="relative">
            <Users
              className={`w-5 h-5 transition-transform duration-200 ${
                currentTab === 'members' ? 'scale-110 text-[#7fb6ac]' : ''
              }`}
            />
            {currentTab === 'members' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1 bg-[#7fb6ac] rounded-full shadow-glow-mint" />
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
                ? 'bg-[#7fb6ac] border-[#9ba9c2] text-[#0c1012] shadow-glow-mint ring-4 ring-[#7fb6ac]/20'
                : 'bg-[#7fb6ac] border-[#2a3639] text-[#0c1012] shadow-glow-mint hover:brightness-110'
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
              ? 'text-[#9ba9c2]'
              : 'text-[#67758d] hover:text-[#9ba9c2]'
          }`}
          aria-label="Expiring Members"
        >
          <div className="relative">
            <ClockAlert
              className={`w-5 h-5 transition-transform duration-200 ${
                currentTab === 'expiring' ? 'scale-110 text-[#7fb6ac]' : ''
              }`}
            />
            {expiringCount > 0 && (
              <span className="absolute -top-1 -right-2.5 min-w-[18px] h-[18px] px-1 bg-[#7fb6ac] text-[#0c1012] text-[10px] font-mono font-black rounded-full flex items-center justify-center ring-2 ring-[#13191b] animate-pulse">
                {expiringCount > 9 ? '9+' : expiringCount}
              </span>
            )}
            {currentTab === 'expiring' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1 bg-[#7fb6ac] rounded-full shadow-glow-mint" />
            )}
          </div>
          <span className="text-[10px] font-mono font-semibold mt-1 tracking-tight">Expiring</span>
        </button>
      </nav>
    </div>
  );
};
