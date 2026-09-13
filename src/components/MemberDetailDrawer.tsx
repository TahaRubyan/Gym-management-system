import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  CreditCard,
  Trash2,
  Edit2,
  Check,
  Receipt,
} from 'lucide-react';
import { Member, Payment } from '../types/gym';
import {
  checkMembershipStatus,
  formatDisplayDate,
  formatDateTime,
  formatDisplayPhone,
  formatPKR,
  buildWhatsAppReminderUrl,
  getRelativeCountdownText,
} from '../utils/dateAndPhone';
import { db, updateMember, deleteMember } from '../services/storage';

interface MemberDetailDrawerProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onLogFee: (member: Member) => void;
  onMemberUpdated: () => void;
  onMemberDeleted: (name: string) => void;
}

export const MemberDetailDrawer: React.FC<MemberDetailDrawerProps> = ({
  member,
  isOpen,
  onClose,
  onLogFee,
  onMemberUpdated,
  onMemberDeleted,
}) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (member) {
      setEditName(member.full_name);
      setEditPhone(member.phone);
      setEditNotes(member.notes || '');
      setIsEditing(false);

      // Load payment history
      db.payments
        .where('member_id')
        .equals(member.id)
        .toArray()
        .then((items) => {
          items.sort((a, b) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime());
          setPayments(items);
        });
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const { status } = checkMembershipStatus(member.expiry_date);
  const countdownText = getRelativeCountdownText(member.expiry_date);
  const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);

  const handleSaveEdit = async () => {
    if (!editName.trim() || !editPhone.trim()) return;
    try {
      setIsSaving(true);
      await updateMember(member.id, {
        full_name: editName.trim(),
        phone: editPhone.trim(),
        notes: editNotes.trim() || undefined,
      });
      setIsEditing(false);
      onMemberUpdated();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to remove ${member.full_name} from Monster Gym? All payment history will be permanently deleted.`
      )
    ) {
      await deleteMember(member.id);
      onMemberDeleted(member.full_name);
      onClose();
    }
  };

  const handleWhatsApp = () => {
    const url = buildWhatsAppReminderUrl(member.full_name, member.phone, member.expiry_date);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div
        className="w-full max-w-lg bg-white border-t sm:border border-[#EAE2D6] rounded-t-[32px] sm:rounded-3xl shadow-apple-modal overflow-hidden max-h-[92vh] flex flex-col pb-[env(safe-area-inset-bottom,16px)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle indicator (Apple spec: 36px x 4px, radius 2px, centered) */}
        <div className="pt-3 pb-1 flex justify-center bg-white">
          <div className="w-9 h-1 rounded-full bg-[#D1D5DB]" />
        </div>

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#EAE2D6] flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EEEEEE] text-[#5B675E] border border-[#EAE2D6] font-black text-base flex items-center justify-center">
              {member.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1C221D] leading-tight font-sans">{member.full_name}</h2>
              <p className="text-xs font-mono text-[#5B675E]">{formatDisplayPhone(member.phone)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-xl text-[#8E9A90] hover:text-[#1C221D] hover:bg-[#F7F2EB] transition-colors cursor-pointer"
              title={isEditing ? 'Cancel Edit' : 'Edit Member'}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#8E9A90] hover:text-[#1C221D] hover:bg-[#F7F2EB] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Edit Form or View Details */}
          {isEditing ? (
            <div className="p-4 bg-[#F7F2EB] border border-[#EAE2D6] rounded-2xl space-y-3 font-sans">
              <p className="text-xs font-mono font-bold text-[#5E6D45] uppercase tracking-wider">
                Edit Member Profile
              </p>
              <div>
                <label className="text-[11px] font-mono text-[#5B675E] font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-11 bg-white border border-[#EAE2D6] rounded-xl px-3 text-sm text-[#1C221D] focus:outline-none focus:border-[#8B9A6E]"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-[#5B675E] font-semibold block mb-1">Phone Number</label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full h-11 bg-white border border-[#EAE2D6] rounded-xl px-3 text-sm text-[#1C221D] focus:outline-none focus:border-[#8B9A6E] font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-[#5B675E] font-semibold block mb-1">Notes / Locker</label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Locker #22"
                  className="w-full h-11 bg-white border border-[#EAE2D6] rounded-xl px-3 text-sm text-[#1C221D] focus:outline-none focus:border-[#8B9A6E]"
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="flex-1 h-11 rounded-xl bg-[#8B9A6E] text-white font-bold text-xs flex items-center justify-center space-x-1.5 font-mono cursor-pointer shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 h-11 rounded-xl bg-white border border-[#EAE2D6] text-[#5B675E] text-xs font-semibold font-mono cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Membership Status KPI Card */}
              <div className="p-4 bg-[#F7F2EB] border border-[#EAE2D6] rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#8E9A90]">
                    Membership Status
                  </span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        status === 'ACTIVE'
                          ? 'bg-[#8B9A6E]/15 border-[#8B9A6E]/30 text-[#5E6D45]'
                          : status === 'EXPIRING_SOON'
                          ? 'bg-[#EAE2D6] border-[#D6C7B2] text-[#7A6648]'
                          : 'bg-[#EEEEEE] border-[#E0E0E0] text-[#6B7280]'
                      }`}
                    >
                      {status === 'ACTIVE'
                        ? 'Active Member'
                        : status === 'EXPIRING_SOON'
                        ? 'Expiring in 48h'
                        : 'Overdue / Expired'}
                    </span>
                  </div>
                  <p className="text-xs text-[#5B675E] mt-1.5 font-mono">{countdownText}</p>
                </div>

                <div className="text-right font-mono">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8E9A90]">
                    Valid Until
                  </span>
                  <p className="text-sm font-black text-[#1C221D] mt-1">
                    {formatDisplayDate(member.expiry_date)}
                  </p>
                  <p className="text-[11px] text-[#8E9A90] mt-0.5">
                    Joined: {formatDisplayDate(member.joined_date)}
                  </p>
                </div>
              </div>

              {/* Quick Communication & Action Bar */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`tel:${member.phone}`}
                  className="p-3 bg-[#F7F2EB] hover:bg-[#EEEEEE] border border-[#EAE2D6] rounded-2xl flex flex-col items-center justify-center text-center transition-colors cursor-pointer shadow-sm"
                >
                  <Phone className="w-5 h-5 text-[#8B9A6E] mb-1" />
                  <span className="text-xs font-mono font-semibold text-[#1C221D]">Call</span>
                </a>

                <button
                  onClick={handleWhatsApp}
                  className="p-3 bg-[#F7F2EB] hover:bg-[#EEEEEE] border border-[#EAE2D6] rounded-2xl flex flex-col items-center justify-center text-center transition-colors cursor-pointer shadow-sm"
                >
                  <MessageSquare className="w-5 h-5 text-[#8B9A6E] mb-1" />
                  <span className="text-xs font-mono font-semibold text-[#1C221D]">WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onLogFee(member);
                  }}
                  className="p-3 bg-[#8B9A6E] hover:bg-[#7D8C61] text-white rounded-2xl flex flex-col items-center justify-center text-center transition-colors shadow-glow-sage cursor-pointer"
                >
                  <CreditCard className="w-5 h-5 mb-1" />
                  <span className="text-xs font-mono font-black">Log 2.5K</span>
                </button>
              </div>

              {/* Member Meta Info */}
              <div className="p-4 bg-[#F7F2EB] border border-[#EAE2D6] rounded-2xl space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-[#EAE2D6]">
                  <span className="text-[#5B675E]">Admission Fee (Month 1):</span>
                  <span className="font-bold text-[#1C221D]">{formatPKR(member.admission_fee)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EAE2D6]">
                  <span className="text-[#5B675E]">Fixed Base Monthly:</span>
                  <span className="font-bold text-[#8B9A6E]">{formatPKR(member.monthly_fee)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EAE2D6]">
                  <span className="text-[#5B675E]">Total Collected to Date:</span>
                  <span className="font-black text-[#1C221D]">{formatPKR(totalPaid)}</span>
                </div>
                {member.notes && (
                  <div className="pt-1">
                    <span className="text-[#5B675E] block mb-0.5">Notes:</span>
                    <p className="text-[#1C221D] italic bg-white p-2.5 rounded-xl border border-[#EAE2D6] font-sans">
                      {member.notes}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Payment History Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1C221D] flex items-center space-x-1.5">
                <Receipt className="w-3.5 h-3.5 text-[#8B9A6E]" />
                <span>PAYMENT HISTORY ({payments.length})</span>
              </h4>
            </div>

            {payments.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#8E9A90] font-mono">
                No payment transactions recorded yet.
              </div>
            ) : (
              <div className="space-y-2">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 bg-[#F7F2EB] border border-[#EAE2D6] rounded-2xl flex items-center justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#1C221D]">
                          {p.fee_type === 'FIRST_MONTH_PACKAGE'
                            ? 'Month 1 Package'
                            : 'Monthly Renewal'}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white text-[#5B675E] font-mono font-semibold border border-[#EAE2D6]">
                          {p.channel}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8E9A90] mt-0.5 font-mono">
                        {formatDateTime(p.paid_at)}
                        {p.transaction_ref && ` • ${p.transaction_ref}`}
                      </p>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-sm font-black text-[#8B9A6E]">
                        {formatPKR(p.amount)}
                      </span>
                      <p className="text-[10px] text-[#8E9A90]">
                        Valid to {formatDisplayDate(p.valid_until)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delete Member Option */}
          <div className="pt-2 border-t border-[#EAE2D6]">
            <button
              onClick={handleDelete}
              className="w-full h-11 px-3 rounded-2xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors text-xs font-mono font-bold flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>DELETE MEMBER RECORD</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
