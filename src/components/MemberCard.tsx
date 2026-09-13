import React from 'react';
import { ChevronRight, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Member } from '../types/gym';
import {
  checkMembershipStatus,
  formatDisplayDate,
  formatDisplayPhone,
  getRelativeCountdownText,
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
  onSelectMember,
}) => {
  const { status } = checkMembershipStatus(member.expiry_date);
  const countdownText = getRelativeCountdownText(member.expiry_date);
  const formattedPhone = formatDisplayPhone(member.phone);

  const statusConfig = {
    ACTIVE: {
      badgeBg: 'bg-[#8B9A6E]/15',
      badgeBorder: 'border-[#8B9A6E]/30',
      badgeText: 'text-[#5E6D45]',
      icon: CheckCircle2,
      label: 'Active',
      leftStripe: 'bg-[#8B9A6E]',
    },
    EXPIRING_SOON: {
      badgeBg: 'bg-[#EAE2D6]',
      badgeBorder: 'border-[#D6C7B2]',
      badgeText: 'text-[#7A6648]',
      icon: AlertTriangle,
      label: 'Expiring',
      leftStripe: 'bg-[#8B9A6E]',
    },
    EXPIRED: {
      badgeBg: 'bg-[#EEEEEE]',
      badgeBorder: 'border-[#E0E0E0]',
      badgeText: 'text-[#6B7280]',
      icon: XCircle,
      label: 'Expired',
      leftStripe: 'bg-[#9CA3AF]',
    },
  }[status];

  const StatusIcon = statusConfig.icon;

  return (
    <div
      onClick={() => onSelectMember(member)}
      className="w-full bg-white hover:bg-[#F7F2EB]/60 border border-[#EAE2D6] hover:border-[#8B9A6E]/50 rounded-2xl p-3.5 sm:p-4 transition-all duration-200 cursor-pointer shadow-apple-card active:scale-[0.98] relative overflow-hidden group select-none"
    >
      {/* Subtle status indicator stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusConfig.leftStripe}`} />

      <div className="pl-2 flex items-center justify-between">
        {/* Leading: 40px Avatar + Name + Metadata */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EEEEEE] border border-[#EAE2D6] flex items-center justify-center text-sm font-black text-[#5B675E] shrink-0">
            {member.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1C221D] group-hover:text-[#8B9A6E] transition-colors leading-tight font-sans">
              {member.full_name}
            </h3>
            <p className="text-xs text-[#5B675E] font-mono tracking-wide mt-0.5">
              {formattedPhone}
            </p>
            <p className="text-[11px] text-[#8E9A90] font-mono mt-0.5">
              Valid until {formatDisplayDate(member.expiry_date)} • {countdownText}
            </p>
          </div>
        </div>

        {/* Trailing: Status Badge Pill + Discovery Chevron */}
        <div className="flex items-center space-x-2 shrink-0">
          <span
            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${statusConfig.badgeBg} ${statusConfig.badgeBorder} ${statusConfig.badgeText}`}
          >
            <StatusIcon className="w-3 h-3 shrink-0" />
            <span>{statusConfig.label}</span>
          </span>

          <ChevronRight className="w-4 h-4 text-[#8E9A90] group-hover:text-[#8B9A6E] transition-colors" />
        </div>
      </div>
    </div>
  );
};
