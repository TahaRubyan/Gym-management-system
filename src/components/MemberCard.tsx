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
      badgeBg: 'bg-[#7fb6ac]/15',
      badgeBorder: 'border-[#7fb6ac]/40',
      badgeText: 'text-[#7fb6ac]',
      icon: CheckCircle2,
      label: 'Active',
      leftStripe: 'bg-[#7fb6ac]',
    },
    EXPIRING_SOON: {
      badgeBg: 'bg-[#9ba9c2]/15',
      badgeBorder: 'border-[#9ba9c2]/40',
      badgeText: 'text-[#9ba9c2]',
      icon: AlertTriangle,
      label: 'Expiring',
      leftStripe: 'bg-[#9ba9c2]',
    },
    EXPIRED: {
      badgeBg: 'bg-[#67758d]/20',
      badgeBorder: 'border-[#67758d]/50',
      badgeText: 'text-[#9ba9c2]',
      icon: XCircle,
      label: 'Expired',
      leftStripe: 'bg-[#67758d]',
    },
  }[status];

  const StatusIcon = statusConfig.icon;

  return (
    <div
      onClick={() => onSelectMember(member)}
      className="w-full bg-[#182023] hover:bg-[#1f282c] border border-[#2a3639] hover:border-[#67758d] rounded-2xl p-3.5 sm:p-4 transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98] relative overflow-hidden group select-none"
    >
      {/* Subtle status indicator stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusConfig.leftStripe}`} />

      <div className="pl-2 flex items-center justify-between">
        {/* Leading: 40px Avatar + Name + Metadata */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#13191b] border border-[#2a3639] flex items-center justify-center text-sm font-black text-[#9ba9c2] shrink-0">
            {member.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#9ba9c2] group-hover:text-[#7fb6ac] transition-colors leading-tight">
              {member.full_name}
            </h3>
            <p className="text-xs text-[#6c7674] font-mono tracking-wide mt-0.5">
              {formattedPhone}
            </p>
            <p className="text-[11px] text-[#67758d] font-mono mt-0.5">
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

          <ChevronRight className="w-4 h-4 text-[#6c7674] group-hover:text-[#7fb6ac] transition-colors" />
        </div>
      </div>
    </div>
  );
};
