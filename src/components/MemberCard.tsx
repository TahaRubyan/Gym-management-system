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
      badgeBg: 'bg-[#EBF1FF]',
      badgeBorder: 'border-[#1A3EEA]/20',
      badgeText: 'text-[#1A3EEA]',
      icon: CheckCircle2,
      label: 'Active',
      leftStripe: 'bg-[#1A3EEA]',
    },
    EXPIRING_SOON: {
      badgeBg: 'bg-[#FFF7ED]',
      badgeBorder: 'border-amber-200',
      badgeText: 'text-amber-700',
      icon: AlertTriangle,
      label: 'Expiring',
      leftStripe: 'bg-amber-500',
    },
    EXPIRED: {
      badgeBg: 'bg-[#F1F5F9]',
      badgeBorder: 'border-[#E2E8F0]',
      badgeText: 'text-[#64748B]',
      icon: XCircle,
      label: 'Expired',
      leftStripe: 'bg-[#94A3B8]',
    },
  }[status];

  const StatusIcon = statusConfig.icon;

  return (
    <div
      onClick={() => onSelectMember(member)}
      className="w-full bg-white hover:bg-[#F8FAFC] border border-[#E9ECEF] hover:border-[#1A3EEA]/40 rounded-[22px] p-3.5 sm:p-4 transition-all duration-200 cursor-pointer shadow-apple-card active:scale-[0.98] relative overflow-hidden group select-none"
    >
      {/* Subtle status indicator stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusConfig.leftStripe}`} />

      <div className="pl-2 flex items-center justify-between">
        {/* Leading: 40px Avatar + Name + Metadata */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#EBF1FF] text-[#1A3EEA] flex items-center justify-center text-sm font-black shrink-0">
            {member.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1A3EEA] transition-colors leading-tight">
              {member.full_name}
            </h3>
            <p className="text-xs text-[#64748B] tracking-wide mt-0.5 font-medium">
              {formattedPhone}
            </p>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">
              Valid until {formatDisplayDate(member.expiry_date)} • {countdownText}
            </p>
          </div>
        </div>

        {/* Trailing: Status Badge Pill + Discovery Chevron */}
        <div className="flex items-center space-x-2 shrink-0">
          <span
            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusConfig.badgeBg} ${statusConfig.badgeBorder} ${statusConfig.badgeText}`}
          >
            <StatusIcon className="w-3 h-3 shrink-0" />
            <span>{statusConfig.label}</span>
          </span>

          <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1A3EEA] transition-colors" />
        </div>
      </div>
    </div>
  );
};
