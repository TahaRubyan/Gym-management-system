import React from 'react';
import { Phone, MessageSquare, CreditCard, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Member } from '../types/gym';
import {
  checkMembershipStatus,
  formatDisplayDate,
  formatDisplayPhone,
  getRelativeCountdownText,
  buildWhatsAppReminderUrl,
} from '../utils/dateAndPhone';

interface MemberCardProps {
  member: Member;
  onLogFee: (member: Member) => void;
  onSelectMember: (member: Member) => void;
  onWhatsAppSent?: (member: Member) => void;
  reminderSent?: boolean;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onLogFee,
  onSelectMember,
  onWhatsAppSent,
  reminderSent,
}) => {
  const { status } = checkMembershipStatus(member.expiry_date);
  const countdownText = getRelativeCountdownText(member.expiry_date);
  const formattedPhone = formatDisplayPhone(member.phone);

  const statusConfig = {
    ACTIVE: {
      badgeBg: 'bg-[#7fb6ac]/15',
      badgeBorder: 'border-[#7fb6ac]/40',
      badgeText: 'text-[#7fb6ac]',
      icon: CheckCircle2,
      label: 'Active',
      avatarRing: 'ring-[#7fb6ac]/30',
      leftStripe: 'bg-[#7fb6ac]',
    },
    EXPIRING_SOON: {
      badgeBg: 'bg-[#9ba9c2]/15',
      badgeBorder: 'border-[#9ba9c2]/40',
      badgeText: 'text-[#9ba9c2]',
      icon: AlertTriangle,
      label: 'Expiring in 48h',
      avatarRing: 'ring-[#9ba9c2]/50 ring-2',
      leftStripe: 'bg-[#9ba9c2]',
    },
    EXPIRED: {
      badgeBg: 'bg-[#67758d]/20',
      badgeBorder: 'border-[#67758d]/50',
      badgeText: 'text-[#9ba9c2]',
      icon: XCircle,
      label: 'Overdue / Expired',
      avatarRing: 'ring-[#67758d]/40',
      leftStripe: 'bg-[#67758d]',
    },
  }[status];

  const StatusIcon = statusConfig.icon;

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = buildWhatsAppReminderUrl(member.full_name, member.phone, member.expiry_date);
    window.open(url, '_blank');
    onWhatsAppSent?.(member);
  };

  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${member.phone}`;
  };

  const handleLogFeeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLogFee(member);
  };

  return (
    <div
      onClick={() => onSelectMember(member)}
      className="w-full bg-[#182023] hover:bg-[#1f282c] border border-[#2a3639] hover:border-[#67758d] rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-md active:scale-[0.99] relative overflow-hidden group select-none"
    >
      {/* Accent left indicator line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusConfig.leftStripe}`} />

      <div className="pl-1.5 flex flex-col space-y-3">
        {/* Top row: Avatar + Name + Status pill */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-11 h-11 rounded-xl bg-[#13191b] border border-[#2a3639] flex items-center justify-center text-sm font-black text-[#9ba9c2] ${statusConfig.avatarRing}`}
            >
              {member.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-bold text-[#9ba9c2] group-hover:text-[#7fb6ac] transition-colors leading-tight">
                  {member.full_name}
                </h3>
              </div>
              <p className="text-xs text-[#6c7674] font-mono tracking-wide mt-0.5">
                {formattedPhone}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-1">
            <span
              className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${statusConfig.badgeBg} ${statusConfig.badgeBorder} ${statusConfig.badgeText}`}
            >
              <StatusIcon className="w-3 h-3 shrink-0" />
              <span>{statusConfig.label}</span>
            </span>

            <span className="text-[11px] text-[#67758d] font-mono">
              {countdownText}
            </span>
          </div>
        </div>

        {/* Expiry date & Notes metadata */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-[#2a3639] font-mono">
          <div className="text-[#6c7674]">
            <span>Pass Valid Until: </span>
            <span className="font-semibold text-[#9ba9c2]">{formatDisplayDate(member.expiry_date)}</span>
          </div>
          {member.notes && (
            <span className="text-[11px] text-[#67758d] truncate max-w-[140px] font-sans">
              {member.notes}
            </span>
          )}
        </div>

        {/* Action Button Strip */}
        <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
          {/* Quick Call */}
          <button
            onClick={handleCallClick}
            className="flex items-center justify-center space-x-1 py-2 px-2.5 rounded-xl bg-[#13191b] hover:bg-[#1f282c] border border-[#2a3639] text-[#9ba9c2] hover:text-[#7fb6ac] transition-all text-xs font-semibold active:scale-95"
            title="Call Member"
          >
            <Phone className="w-3.5 h-3.5 text-[#7fb6ac]" />
            <span>Call</span>
          </button>

          {/* Quick WhatsApp Reminder */}
          <button
            onClick={handleWhatsAppClick}
            className={`flex items-center justify-center space-x-1 py-2 px-2.5 rounded-xl border transition-all text-xs font-semibold active:scale-95 ${
              reminderSent
                ? 'bg-[#7fb6ac]/20 border-[#7fb6ac] text-[#7fb6ac]'
                : 'bg-[#13191b] hover:bg-[#1f282c] border-[#2a3639] text-[#9ba9c2] hover:border-[#7fb6ac]/40'
            }`}
            title="Send WhatsApp Reminder"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#7fb6ac]" />
            <span>{reminderSent ? 'Sent' : 'WhatsApp'}</span>
          </button>

          {/* Log PKR 2500 Fee */}
          <button
            onClick={handleLogFeeClick}
            className="flex items-center justify-center space-x-1 py-2 px-2.5 rounded-xl bg-[#7fb6ac] hover:bg-[#70a59b] text-[#0c1012] font-black transition-all text-xs active:scale-95 shadow-glow-mint"
            title="Log Fee Renewal"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Log Fee</span>
          </button>
        </div>
      </div>
    </div>
  );
};
