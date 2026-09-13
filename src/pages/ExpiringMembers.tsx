import React from 'react';
import { motion } from 'motion/react';
import {
  ClockAlert,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import { Member } from '../types/gym';
import {
  checkMembershipStatus,
  formatDisplayDate,
  formatDisplayPhone,
  getRelativeCountdownText,
  buildWhatsAppReminderUrl,
} from '../utils/dateAndPhone';

interface ExpiringMembersProps {
  members: Member[];
  onLogFee: (member: Member) => void;
  onSelectMember: (member: Member) => void;
  onWhatsAppSent: (member: Member) => void;
  sentReminderMemberIds: Set<string>;
}

export const ExpiringMembers: React.FC<ExpiringMembersProps> = ({
  members,
  onSelectMember,
  onWhatsAppSent,
  sentReminderMemberIds,
}) => {
  // Strictly filter to members in 48-hour window (EXPIRING_SOON)
  const expiringMembers = members.filter((m) => {
    const { status } = checkMembershipStatus(m.expiry_date);
    return status === 'EXPIRING_SOON';
  });

  // Sort by earliest expiration first
  expiringMembers.sort((a, b) => {
    return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
  });

  const handleSendReminder = (e: React.MouseEvent, member: Member) => {
    e.stopPropagation();
    const url = buildWhatsAppReminderUrl(member.full_name, member.phone, member.expiry_date);
    window.open(url, '_blank');
    onWhatsAppSent(member);
  };

  return (
    <div className="space-y-3.5 pb-28 px-4 pt-2 max-w-md mx-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#1A3EEA] uppercase tracking-wider flex items-center gap-1.5">
            <ClockAlert className="w-3.5 h-3.5 text-[#1A3EEA]" />
            48-HOUR RADAR
          </span>
          <h2 className="text-xl font-black text-[#0F172A] tracking-tight">Expiring Soon</h2>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#EBF1FF] text-[#1A3EEA] text-xs font-bold">
          {expiringMembers.length} DUE
        </span>
      </div>

      {/* Empty State */}
      {expiringMembers.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white border border-[#E9ECEF] rounded-[28px] shadow-apple-card space-y-2.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF1FF] text-[#1A3EEA] flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">All Passes Up to Date!</h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-xs mx-auto">
              Zero memberships expiring in the next 48 hours.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {expiringMembers.map((member, idx) => {
            const countdownText = getRelativeCountdownText(member.expiry_date);
            const isSent = sentReminderMemberIds.has(member.id);
            const isPriorityTest = member.phone === '03481488937' || member.phone === '03177769001';

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
                onClick={() => onSelectMember(member)}
                className={`w-full bg-white border rounded-[24px] p-4 shadow-apple-card cursor-pointer active:scale-[0.98] transition-all relative overflow-hidden group ${
                  isPriorityTest ? 'border-[#1A3EEA] ring-1 ring-[#1A3EEA]/20' : 'border-[#E9ECEF] hover:border-[#1A3EEA]/40'
                }`}
              >
                {/* Urgent indicator stripe */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1A3EEA]" />

                <div className="pl-2 space-y-3">
                  {/* Top: Avatar + Name + Expiry badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#EBF1FF] text-[#1A3EEA] flex items-center justify-center text-sm font-black shrink-0">
                        {member.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1A3EEA] transition-colors leading-tight">
                            {member.full_name}
                          </h3>
                          {isPriorityTest && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#1A3EEA] text-white">
                              TEST
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#64748B] mt-0.5 font-medium">
                          {formatDisplayPhone(member.phone)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EBF1FF] text-[#1A3EEA]">
                        {countdownText}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1A3EEA] transition-colors" />
                    </div>
                  </div>

                  {/* Single Focused Action: 1-Tap WhatsApp Reminder */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E9ECEF]">
                    <span className="text-[11px] text-[#64748B]">
                      Expires {formatDisplayDate(member.expiry_date)}
                    </span>

                    <button
                      onClick={(e) => handleSendReminder(e, member)}
                      className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all active:scale-95 border cursor-pointer ${
                        isSent
                          ? 'bg-[#EBF1FF] border-[#1A3EEA]/30 text-[#1A3EEA]'
                          : 'bg-[#1A3EEA] hover:bg-[#1534D8] text-white border-[#1A3EEA] shadow-glow-blue'
                      }`}
                    >
                      {isSent ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Sent</span>
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp Reminder</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
