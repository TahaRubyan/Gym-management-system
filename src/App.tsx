import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, initializeDatabase, calculateDashboardMetrics, logWhatsAppReminder } from './services/storage';
import { Member, DashboardMetrics } from './types/gym';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { ToastContainer, ToastMessage } from './components/Toast';
import { LogFeeModal } from './components/LogFeeModal';
import { MemberDetailDrawer } from './components/MemberDetailDrawer';
import { WelcomeSplash } from './components/WelcomeSplash';
import { Dashboard } from './pages/Dashboard';
import { MembersList } from './pages/MembersList';
import { AddMember } from './pages/AddMember';
import { ExpiringMembers } from './pages/ExpiringMembers';
import { checkMembershipStatus, formatDisplayDate, formatPKR } from './utils/dateAndPhone';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isInitialized, setIsInitialized] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Modals & Drawers state
  const [isLogFeeOpen, setIsLogFeeOpen] = useState(false);
  const [feeTargetMember, setFeeTargetMember] = useState<Member | null>(null);
  const [drawerMember, setDrawerMember] = useState<Member | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Track dispatched reminders in current session
  const [sentReminderMemberIds, setSentReminderMemberIds] = useState<Set<string>>(new Set());

  // Initialize IndexedDB on startup
  useEffect(() => {
    initializeDatabase()
      .catch((err) => console.error('Database initialization error:', err))
      .finally(() => setIsInitialized(true));
  }, []);

  // System scroll listener for floating scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to top smoothly whenever current tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  // Reactive live query for all members
  const members = useLiveQuery(
    async () => {
      const list = await db.members.toArray();
      return list.sort((a, b) => a.full_name.localeCompare(b.full_name));
    },
    [],
    [] as Member[]
  );

  // Reactive live query for dashboard metrics
  const metrics = useLiveQuery(
    async () => {
      return await calculateDashboardMetrics();
    },
    [members],
    null as DashboardMetrics | null
  );

  // Reactive live query for reminder logs to populate sent state
  useLiveQuery(async () => {
    const logs = await db.reminders.toArray();
    const ids = new Set(logs.map((l) => l.member_id));
    setSentReminderMemberIds(ids);
  }, []);

  // Compute live expiring count for bottom navigation badge
  const expiringCount = members.reduce((acc, m) => {
    const { status } = checkMembershipStatus(m.expiry_date);
    return status === 'EXPIRING_SOON' ? acc + 1 : acc;
  }, 0);

  // Toast Management
  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Action Handlers
  const handleOpenLogFee = (member?: Member) => {
    setFeeTargetMember(member || null);
    setIsLogFeeOpen(true);
  };

  const handleSelectMemberForDrawer = (member: Member) => {
    setDrawerMember(member);
    setIsDrawerOpen(true);
  };

  const handleFeeSuccess = (memberName: string, newExpiry: string, amount: number) => {
    addToast(
      'success',
      'Renewal Recorded',
      `Logged ${formatPKR(amount)} for ${memberName}. New expiry: ${formatDisplayDate(newExpiry)}`
    );
    // Keep drawer member up to date if open
    if (drawerMember && drawerMember.full_name === memberName) {
      db.members.get(drawerMember.id).then((m) => {
        if (m) setDrawerMember(m);
      });
    }
  };

  const handleAddMemberSuccess = (memberName: string, totalAmount: number) => {
    addToast(
      'success',
      'Member Registered',
      `${memberName} enrolled with initial collection of ${formatPKR(totalAmount)}`
    );
    setCurrentTab('members');
  };

  const handleWhatsAppSent = async (member: Member) => {
    setSentReminderMemberIds((prev) => new Set([...prev, member.id]));
    await logWhatsAppReminder(member.id, member.expiry_date);
    addToast(
      'info',
      'WhatsApp Dispatched',
      `Reminder link generated for ${member.full_name} (${member.phone})`
    );
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-[#EBF1FF] flex items-center justify-center animate-pulse mb-4">
          <div className="w-6 h-6 rounded-full border-2 border-[#1A3EEA] border-t-transparent animate-spin" />
        </div>
        <h1 className="text-base font-extrabold text-[#0F172A] tracking-tight">
          Monster Gym
        </h1>
        <p className="text-xs text-[#64748B] mt-1 font-medium">Loading system...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#0F172A] flex flex-col selection:bg-[#1A3EEA] selection:text-white relative">
      {/* Toast Alert Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Initial Cinematic Welcome / Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="welcome-splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 z-50"
          >
            <WelcomeSplash onContinue={() => setShowSplash(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <Header
        onResetSeed={() => {
          addToast('info', 'Database Reset', 'Monster Gym restored to initial demo data');
        }}
        onOpenSplash={() => setShowSplash(true)}
      />

      {/* Screen Views with Fluid Transitions */}
      <main className="flex-1 w-full max-w-md mx-auto relative">
        <AnimatePresence mode="wait">
          {currentTab === 'dashboard' && (
            <motion.div
              key="tab-dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <Dashboard
                metrics={metrics}
                onNavigate={setCurrentTab}
                onOpenLogFee={() => handleOpenLogFee()}
              />
            </motion.div>
          )}

          {currentTab === 'members' && (
            <motion.div
              key="tab-members"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <MembersList
                members={members}
                onLogFee={handleOpenLogFee}
                onSelectMember={handleSelectMemberForDrawer}
                onAddNew={() => setCurrentTab('add-member')}
                onWhatsAppSent={handleWhatsAppSent}
                sentReminderMemberIds={sentReminderMemberIds}
              />
            </motion.div>
          )}

          {currentTab === 'add-member' && (
            <motion.div
              key="tab-add-member"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <AddMember
                onSuccess={handleAddMemberSuccess}
                onCancel={() => setCurrentTab('members')}
              />
            </motion.div>
          )}

          {currentTab === 'expiring' && (
            <motion.div
              key="tab-expiring"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <ExpiringMembers
                members={members}
                onLogFee={handleOpenLogFee}
                onSelectMember={handleSelectMemberForDrawer}
                onWhatsAppSent={handleWhatsAppSent}
                sentReminderMemberIds={sentReminderMemberIds}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Scroll-to-Top Action Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            title="Scroll to Top"
            className="fixed bottom-24 right-4 sm:right-6 z-40 w-11 h-11 rounded-full bg-white/95 backdrop-blur-xl border border-[#E9ECEF] text-[#1A3EEA] shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:bg-[#EBF1FF] active:scale-90 transition-transform flex items-center justify-center cursor-pointer"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom Frosted Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        expiringCount={expiringCount}
      />

      {/* Renewal / Log Fee Modal */}
      <LogFeeModal
        isOpen={isLogFeeOpen}
        onClose={() => setIsLogFeeOpen(false)}
        members={members}
        preselectedMember={feeTargetMember}
        onSuccess={handleFeeSuccess}
      />

      {/* Member Details Drawer */}
      <MemberDetailDrawer
        isOpen={isDrawerOpen}
        member={drawerMember}
        onClose={() => setIsDrawerOpen(false)}
        onLogFee={handleOpenLogFee}
        onMemberUpdated={() => {
          addToast('success', 'Profile Updated', 'Member details saved successfully');
        }}
        onMemberDeleted={(name) => {
          addToast('error', 'Member Removed', `${name} deleted from gym roster`);
        }}
      />
    </div>
  );
};
