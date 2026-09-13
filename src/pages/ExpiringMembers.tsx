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
          <span className="text-[10px] font-mono font-bold text-[#5E6D45] uppercase tracking-wider flex items-center gap-1.5">
            <ClockAlert className="w-3.5 h-3.5 text-[#8B9A6E]" />
            48-HOUR RADAR
          </span>
          <h2 className="text-xl font-black text-[#1C221D] tracking-tight font-sans">Expiring Soon</h2>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#8B9A6E]/15 text-[#5E6D45] border border-[#8B9A6E]/30 text-xs font-mono font-bold">
          {expiringMembers.length} DUE
        </span>
      </div>

      {/* Empty State */}
      {expiringMembers.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white border border-[#EAE2D6] rounded-3xl shadow-apple-card space-y-2.5">
          <div className="w-12 h-12 rounded-2xl bg-[#8B9A6E]/15 text-[#8B9A6E] flex items-center justify-center mx-auto border border-[#8B9A6E]/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1C221D]">All Passes Up to Date!</h3>
            <p className="text-xs text-[#5B675E] mt-1 max-w-xs mx-auto">
              Zero memberships expiring in the next 48 hours.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {expiringMembers.map((member, idx) => {
            const countdownText = getRelativeCountdownText(member.expiry_date);
            const isSent = sentReminderMemberIds.has(member.id);

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
                onClick={() => onSelectMember(member)}
                className="w-full bg-white border border-[#8B9A6E]/40 hover:border-[#8B9A6E] rounded-2xl p-4 shadow-apple-card cursor-pointer active:scale-[0.98] transition-all relative overflow-hidden group"
              >
                {/* Urgent indicator stripe */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8B9A6E]" />

                <div className="pl-2 space-y-3">
                  {/* Top: Avatar + Name + Expiry badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#EEEEEE] border border-[#EAE2D6] flex items-center justify-center text-sm font-black text-[#5B675E] shrink-0">
                        {member.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#1C221D] group-hover:text-[#8B9A6E] transition-colors leading-tight font-sans">
                          {member.full_name}
                        </h3>
                        <p className="text-xs text-[#5B675E] font-mono mt-0.5">
                          {formatDisplayPhone(member.phone)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EAE2D6] border border-[#D6C7B2] text-[#7A6648]">
                        {countdownText}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#8E9A90] group-hover:text-[#8B9A6E] transition-colors" />
                    </div>
                  </div>

                  {/* Single Focused Action: 1-Tap WhatsApp Reminder (Figma Thumb-friendly) */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#EAE2D6]">
                    <span className="text-[11px] font-mono text-[#8E9A90]">
                      Valid until {formatDisplayDate(member.expiry_date)}
                    </span>

                    <button
                      onClick={(e) => handleSendReminder(e, member)}
                      className={`h-9 px-3 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all active:scale-95 border cursor-pointer ${
                        isSent
                          ? 'bg-[#8B9A6E]/15 border-[#8B9A6E] text-[#5E6D45]'
                          : 'bg-[#8B9A6E] hover:bg-[#7D8C61] text-white border-[#8B9A6E] shadow-glow-sage'
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
                          <span>WhatsApp</span>
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
