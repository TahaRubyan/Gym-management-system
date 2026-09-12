import React from 'react';
import { motion } from 'motion/react';
import {
  ClockAlert,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  CreditCard,
  Phone,
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
  onLogFee,
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

  const handleSendReminder = (member: Member) => {
    const url = buildWhatsAppReminderUrl(member.full_name, member.phone, member.expiry_date);
    window.open(url, '_blank');
    onWhatsAppSent(member);
  };

  return (
    <div className="space-y-4 pb-28 px-4 pt-2 max-w-md mx-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#7fb6ac] uppercase tracking-widest flex items-center gap-1.5">
            <ClockAlert className="w-3.5 h-3.5" />
            48-HOUR RADAR
          </span>
          <h2 className="text-xl font-black text-[#9ba9c2] tracking-tight">Expiring Passes</h2>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#7fb6ac]/15 text-[#7fb6ac] border border-[#7fb6ac]/40 text-xs font-mono font-bold">
          {expiringMembers.length} {expiringMembers.length === 1 ? 'MEMBER' : 'MEMBERS'} DUE
        </span>
      </div>

      {/* Priority Action Radar Banner */}
      <div className="p-4 rounded-3xl bg-[#182023] border border-[#7fb6ac]/40 text-xs text-[#9ba9c2] space-y-1.5 shadow-lg">
        <div className="flex items-center space-x-2 text-[#7fb6ac] font-bold text-xs">
          <span className="w-2 h-2 rounded-full bg-[#7fb6ac] animate-ping" />
          <span className="font-mono uppercase tracking-wider">Automated Dispatch Ready</span>
        </div>
        <p className="leading-relaxed font-sans text-[#6c7674]">
          These members expire within <strong>48 hours</strong>.
          Tap the WhatsApp button below to trigger Dastagir Kanth's personalized reminder message.
        </p>
      </div>

      {/* Empty State */}
      {expiringMembers.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#182023] border border-[#2a3639] rounded-3xl space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#7fb6ac]/15 text-[#7fb6ac] flex items-center justify-center mx-auto border border-[#7fb6ac]/30">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#9ba9c2]">All Passes Up to Date!</h3>
            <p className="text-xs text-[#6c7674] mt-1 max-w-xs mx-auto">
              Zero members expiring in the next 48 hours. Excellent roster collection this cycle!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          {expiringMembers.map((member, idx) => {
            const countdownText = getRelativeCountdownText(member.expiry_date);
            const isSent = sentReminderMemberIds.has(member.id);

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="w-full bg-[#182023] border border-[#7fb6ac]/40 hover:border-[#7fb6ac] rounded-2xl p-4 shadow-md relative overflow-hidden group"
              >
                {/* Urgent Left Stripe */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7fb6ac]" />

                <div className="pl-2 space-y-3">
                  {/* Top: Avatar + Name + Expiry badge */}
                  <div className="flex items-start justify-between">
                    <div
                      onClick={() => onSelectMember(member)}
                      className="cursor-pointer flex items-center space-x-3"
                    >
                      <div className="w-11 h-11 rounded-xl bg-[#13191b] border border-[#7fb6ac]/40 ring-2 ring-[#7fb6ac]/20 flex items-center justify-center text-sm font-black text-[#9ba9c2]">
                        {member.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#9ba9c2] group-hover:text-[#7fb6ac] transition-colors leading-tight">
                          {member.full_name}
                        </h3>
                        <p className="text-xs text-[#6c7674] font-mono tracking-wide mt-0.5">
                          {formatDisplayPhone(member.phone)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#7fb6ac]/15 border border-[#7fb6ac]/40 text-[#7fb6ac]">
                        {countdownText}
                      </span>
                      <span className="text-[10px] text-[#6c7674] font-mono mt-1">
                        {formatDisplayDate(member.expiry_date)}
                      </span>
                    </div>
                  </div>

                  {member.notes && (
                    <div className="text-[11px] text-[#67758d] bg-[#13191b] px-3 py-1.5 rounded-xl border border-[#2a3639]">
                      {member.notes}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
                    {/* Call Button */}
                    <button
                      onClick={() => (window.location.href = `tel:${member.phone}`)}
                      className="py-2.5 px-2 rounded-xl bg-[#13191b] hover:bg-[#1f282c] border border-[#2a3639] text-[#9ba9c2] hover:text-[#7fb6ac] text-xs font-semibold flex items-center justify-center space-x-1 transition-all active:scale-95 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#7fb6ac]" />
                      <span>Call</span>
                    </button>

                    {/* WhatsApp Button */}
                    <button
                      onClick={() => handleSendReminder(member)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all active:scale-95 border cursor-pointer ${
                        isSent
                          ? 'bg-[#7fb6ac]/20 border-[#7fb6ac] text-[#7fb6ac]'
                          : 'bg-[#7fb6ac]/15 hover:bg-[#7fb6ac]/25 border-[#7fb6ac]/40 text-[#7fb6ac]'
                      }`}
                    >
                      {isSent ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#7fb6ac]" />
                          <span>Sent</span>
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-3.5 h-3.5 text-[#7fb6ac]" />
                          <span>WhatsApp</span>
                        </>
                      )}
                    </button>

                    {/* Quick Renew PKR 2,500 */}
                    <button
                      onClick={() => onLogFee(member)}
                      className="py-2.5 px-2 rounded-xl bg-[#7fb6ac] hover:bg-[#70a59b] text-[#0c1012] font-black text-xs flex items-center justify-center space-x-1 transition-all active:scale-95 shadow-glow-mint cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Renew 2.5K</span>
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
