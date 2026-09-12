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
      badgeBg: 'bg-[#10B981]/15',
      badgeBorder: 'border-[#10B981]/40',
      badgeText: 'text-[#6EE7B7]',
      glow: 'shadow-emerald-500/10',
      icon: CheckCircle2,
      label: 'Active',
      avatarRing: 'ring-[#10B981]/30',
      leftStripe: 'bg-[#10B981]',
    },
    EXPIRING_SOON: {
      badgeBg: 'bg-[#F59E0B]/20',
      badgeBorder: 'border-[#F59E0B]/50',
      badgeText: 'text-[#FCD34D]',
      glow: 'shadow-amber-500/20',
      icon: AlertTriangle,
      label: 'Expiring in 48h',
      avatarRing: 'ring-[#F59E0B]/50 ring-2',
      leftStripe: 'bg-[#F59E0B]',
    },
    EXPIRED: {
      badgeBg: 'bg-[#EF4444]/15',
      badgeBorder: 'border-[#EF4444]/40',
      badgeText: 'text-[#FCA5A5]',
      glow: 'shadow-red-500/10',
      icon: XCircle,
      label: 'Overdue / Expired',
      avatarRing: 'ring-[#EF4444]/40',
      leftStripe: 'bg-[#EF4444]',
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
      className="w-full bg-[#0F1522] hover:bg-[#141C2C] border border-[#1E2B3E] hover:border-[#2B3E59] rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-lg active:scale-[0.99] relative overflow-hidden group select-none"
    >
      {/* Accent left indicator line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusConfig.leftStripe}`} />

      <div className="pl-1.5 flex flex-col space-y-3">
        {/* Top row: Avatar + Name + Status pill */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-11 h-11 rounded-xl bg-[#162032] border border-[#223048] flex items-center justify-center text-sm font-black text-[#E2E8F0] ${statusConfig.avatarRing}`}
            >
              {member.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-bold text-[#E2E8F0] group-hover:text-[#6EE7B7] transition-colors leading-tight">
                  {member.full_name}
                </h3>
              </div>
              <p className="text-xs text-[#94A3B8] font-mono tracking-wide mt-0.5">
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

            <span className="text-[11px] text-[#94A3B8] font-mono">
              {countdownText}
            </span>
          </div>
        </div>

        {/* Expiry date & Notes metadata */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1E2B3E]/80 font-mono">
          <div className="text-[#94A3B8]">
            <span>Pass Valid Until: </span>
            <span className="font-semibold text-[#E2E8F0]">{formatDisplayDate(member.expiry_date)}</span>
          </div>
          {member.notes && (
            <span className="text-[11px] text-[#64748B] truncate max-w-[140px] font-sans">
              {member.notes}
            </span>
          )}
        </div>

        {/* Action Button Strip */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Quick Call */}
          <button
            onClick={handleCallClick}
            className="flex items-center justify-center space-x-1 py-2 px-2.5 rounded-xl bg-[#162032] hover:bg-[#1E2B3E] border border-[#223048] text-[#94A3B8] hover:text-[#E2E8F0] transition-all text-xs font-semibold active:scale-95"
            title="Call Member"
          >
            <Phone className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Call</span>
          </button>

          {/* Quick WhatsApp Reminder */}
          <button
            onClick={handleWhatsAppClick}
            className={`flex items-center justify-center space-x-1 py-2 px-2.5 rounded-xl border transition-all text-xs font-semibold active:scale-95 ${
              reminderSent
                ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#6EE7B7]'
                : 'bg-[#162032] hover:bg-[#1E2B3E] border-[#223048] text-[#94A3B8] hover:text-[#E2E8F0]'
            }`}
            title="Send WhatsApp Reminder"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
            <span>{reminderSent ? 'Sent' : 'WhatsApp'}</span>
          </button>

          {/* Log PKR 2500 Fee */}
          <button
            onClick={handleLogFeeClick}
            className="flex items-center justify-center space-x-1 py-2 px-2.5 rounded-xl bg-[#10B981]/20 hover:bg-[#10B981]/30 border border-[#10B981]/40 text-[#6EE7B7] hover:text-[#E2E8F0] transition-all text-xs font-bold active:scale-95 shadow-sm"
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
