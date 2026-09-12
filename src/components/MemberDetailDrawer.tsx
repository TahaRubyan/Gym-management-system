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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div
        className="w-full max-w-lg bg-[#0F1522] border-t sm:border border-[#1E2B3E] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col pb-[env(safe-area-inset-bottom,16px)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1E2B3E] flex items-center justify-between bg-[#121A28]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#6EE7B7] border border-[#10B981]/30 font-black text-base flex items-center justify-center">
              {member.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#E2E8F0] leading-tight">{member.full_name}</h2>
              <p className="text-xs font-mono text-[#94A3B8]">{formatDisplayPhone(member.phone)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-xl text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#1E2B3E] transition-colors"
              title={isEditing ? 'Cancel Edit' : 'Edit Member'}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#1E2B3E] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Edit Form or View Details */}
          {isEditing ? (
            <div className="p-4 bg-[#121A28] border border-[#1E2B3E] rounded-2xl space-y-3 font-sans">
              <p className="text-xs font-mono font-bold text-[#6EE7B7] uppercase tracking-wider">
                Edit Member Profile
              </p>
              <div>
                <label className="text-[11px] font-mono text-[#94A3B8] font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#0F1522] border border-[#1E2B3E] rounded-xl px-3 py-2 text-sm text-[#E2E8F0] focus:outline-none focus:border-[#10B981]"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-[#94A3B8] font-semibold block mb-1">Phone Number</label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-[#0F1522] border border-[#1E2B3E] rounded-xl px-3 py-2 text-sm text-[#E2E8F0] focus:outline-none focus:border-[#10B981] font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-[#94A3B8] font-semibold block mb-1">Notes / Locker</label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Locker #22"
                  className="w-full bg-[#0F1522] border border-[#1E2B3E] rounded-xl px-3 py-2 text-sm text-[#E2E8F0] focus:outline-none focus:border-[#10B981]"
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="flex-1 py-2 rounded-xl bg-[#10B981] text-[#080B11] font-bold text-xs flex items-center justify-center space-x-1.5 font-mono"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-[#1E2B3E] text-[#94A3B8] text-xs font-semibold font-mono"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Membership Status KPI Card */}
              <div className="p-4 bg-[#121A28] border border-[#1E2B3E] rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#94A3B8]">
                    Membership Status
                  </span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        status === 'ACTIVE'
                          ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#6EE7B7]'
                          : status === 'EXPIRING_SOON'
                          ? 'bg-[#F59E0B]/20 border-[#F59E0B]/50 text-[#FCD34D]'
                          : 'bg-[#EF4444]/20 border-[#EF4444]/40 text-[#FCA5A5]'
                      }`}
                    >
                      {status === 'ACTIVE'
                        ? 'Active Member'
                        : status === 'EXPIRING_SOON'
                        ? 'Expiring in 48h'
                        : 'Overdue / Expired'}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1.5 font-mono">{countdownText}</p>
                </div>

                <div className="text-right font-mono">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8]">
                    Valid Until
                  </span>
                  <p className="text-sm font-black text-[#E2E8F0] mt-1">
                    {formatDisplayDate(member.expiry_date)}
                  </p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Joined: {formatDisplayDate(member.joined_date)}
                  </p>
                </div>
              </div>

              {/* Quick Communication & Action Bar */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`tel:${member.phone}`}
                  className="p-3 bg-[#121A28] hover:bg-[#1E2B3E] border border-[#1E2B3E] rounded-xl flex flex-col items-center justify-center text-center transition-colors"
                >
                  <Phone className="w-5 h-5 text-[#10B981] mb-1" />
                  <span className="text-xs font-mono font-semibold text-[#E2E8F0]">Call</span>
                </a>

                <button
                  onClick={handleWhatsApp}
                  className="p-3 bg-[#121A28] hover:bg-[#1E2B3E] border border-[#1E2B3E] rounded-xl flex flex-col items-center justify-center text-center transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-[#25D366] mb-1" />
                  <span className="text-xs font-mono font-semibold text-[#E2E8F0]">WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onLogFee(member);
                  }}
                  className="p-3 bg-[#10B981]/20 hover:bg-[#10B981]/30 border border-[#10B981]/40 rounded-xl flex flex-col items-center justify-center text-center transition-colors shadow-sm"
                >
                  <CreditCard className="w-5 h-5 text-[#6EE7B7] mb-1" />
                  <span className="text-xs font-mono font-bold text-[#6EE7B7]">Log 2.5K</span>
                </button>
              </div>

              {/* Member Meta Info */}
              <div className="p-4 bg-[#121A28]/80 border border-[#1E2B3E] rounded-2xl space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-[#1E2B3E]">
                  <span className="text-[#94A3B8]">Admission Fee (Month 1):</span>
                  <span className="font-semibold text-[#E2E8F0]">{formatPKR(member.admission_fee)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E2B3E]">
                  <span className="text-[#94A3B8]">Fixed Base Monthly:</span>
                  <span className="font-semibold text-[#6EE7B7]">{formatPKR(member.monthly_fee)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1E2B3E]">
                  <span className="text-[#94A3B8]">Total Collected to Date:</span>
                  <span className="font-black text-[#E2E8F0]">{formatPKR(totalPaid)}</span>
                </div>
                {member.notes && (
                  <div className="pt-1">
                    <span className="text-[#94A3B8] block mb-0.5">Notes:</span>
                    <p className="text-[#CBD5E1] italic bg-[#0F1522] p-2 rounded-lg border border-[#1E2B3E] font-sans">
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
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#94A3B8] flex items-center space-x-1.5">
                <Receipt className="w-3.5 h-3.5 text-[#10B981]" />
                <span>PAYMENT HISTORY ({payments.length})</span>
              </h4>
            </div>

            {payments.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#64748B] font-mono">
                No payment transactions recorded yet.
              </div>
            ) : (
              <div className="space-y-2">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-[#121A28] border border-[#1E2B3E] rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#E2E8F0]">
                          {p.fee_type === 'FIRST_MONTH_PACKAGE'
                            ? 'Month 1 Package'
                            : 'Monthly Renewal'}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#162032] text-[#94A3B8] font-mono font-semibold border border-[#223048]">
                          {p.channel}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5 font-mono">
                        {formatDateTime(p.paid_at)}
                        {p.transaction_ref && ` • ${p.transaction_ref}`}
                      </p>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-sm font-bold text-[#6EE7B7]">
                        {formatPKR(p.amount)}
                      </span>
                      <p className="text-[10px] text-[#94A3B8]">
                        Valid to {formatDisplayDate(p.valid_until)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delete Member Option */}
          <div className="pt-2 border-t border-[#1E2B3E]">
            <button
              onClick={handleDelete}
              className="w-full py-2.5 px-3 rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 text-[#FCA5A5] hover:bg-[#EF4444]/20 transition-colors text-xs font-mono font-bold flex items-center justify-center space-x-1.5"
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
