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
        className="w-full max-w-lg bg-white border-t sm:border border-[#E9ECEF] rounded-t-[32px] sm:rounded-3xl shadow-apple-modal overflow-hidden max-h-[92vh] flex flex-col pb-[env(safe-area-inset-bottom,16px)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle indicator (Apple spec: 36px x 4px, radius 2px, centered) */}
        <div className="pt-3 pb-1 flex justify-center bg-white">
          <div className="w-9 h-1 rounded-full bg-[#D1D5DB]" />
        </div>

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#E9ECEF] flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#EBF1FF] text-[#1A3EEA] font-black text-base flex items-center justify-center">
              {member.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A] leading-tight">{member.full_name}</h2>
              <p className="text-xs text-[#64748B] font-medium">{formatDisplayPhone(member.phone)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-xl text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              title={isEditing ? 'Cancel Edit' : 'Edit Member'}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Edit Form or View Details */}
          {isEditing ? (
            <div className="p-4 bg-[#F8FAFC] border border-[#E9ECEF] rounded-2xl space-y-3">
              <p className="text-xs font-bold text-[#1A3EEA] uppercase tracking-wider">
                Edit Member Profile
              </p>
              <div>
                <label className="text-[11px] text-[#64748B] font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-11 bg-white border border-[#E9ECEF] rounded-xl px-3 text-sm text-[#0F172A] focus:outline-none focus:border-[#1A3EEA]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#64748B] font-semibold block mb-1">Phone Number</label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full h-11 bg-white border border-[#E9ECEF] rounded-xl px-3 text-sm text-[#0F172A] focus:outline-none focus:border-[#1A3EEA] font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#64748B] font-semibold block mb-1">Notes / Locker</label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Locker #22"
                  className="w-full h-11 bg-white border border-[#E9ECEF] rounded-xl px-3 text-sm text-[#0F172A] focus:outline-none focus:border-[#1A3EEA]"
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="flex-1 h-11 rounded-xl bg-[#1A3EEA] text-white font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 h-11 rounded-xl bg-white border border-[#E9ECEF] text-[#64748B] text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Membership Status KPI Card */}
              <div className="p-4 bg-[#F8FAFC] border border-[#E9ECEF] rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8]">
                    Membership Status
                  </span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        status === 'ACTIVE'
                          ? 'bg-[#EBF1FF] border-[#1A3EEA]/20 text-[#1A3EEA]'
                          : status === 'EXPIRING_SOON'
                          ? 'bg-amber-50 border-amber-200 text-amber-700'
                          : 'bg-[#F1F5F9] border-[#E2E8F0] text-[#64748B]'
                      }`}
                    >
                      {status === 'ACTIVE'
                        ? 'Active Member'
                        : status === 'EXPIRING_SOON'
                        ? 'Expiring in 48h'
                        : 'Overdue / Expired'}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1.5">{countdownText}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8]">
                    Valid Until
                  </span>
                  <p className="text-sm font-black text-[#0F172A] mt-1">
                    {formatDisplayDate(member.expiry_date)}
                  </p>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    Joined: {formatDisplayDate(member.joined_date)}
                  </p>
                </div>
              </div>

              {/* Quick Communication & Action Bar */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`tel:${member.phone}`}
                  className="p-3 bg-[#F8FAFC] hover:bg-[#EBF1FF] border border-[#E9ECEF] rounded-2xl flex flex-col items-center justify-center text-center transition-colors cursor-pointer shadow-sm"
                >
                  <Phone className="w-5 h-5 text-[#1A3EEA] mb-1" />
                  <span className="text-xs font-semibold text-[#0F172A]">Call</span>
                </a>

                <button
                  onClick={handleWhatsApp}
                  className="p-3 bg-[#F8FAFC] hover:bg-[#EBF1FF] border border-[#E9ECEF] rounded-2xl flex flex-col items-center justify-center text-center transition-colors cursor-pointer shadow-sm"
                >
                  <MessageSquare className="w-5 h-5 text-[#1A3EEA] mb-1" />
                  <span className="text-xs font-semibold text-[#0F172A]">WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onLogFee(member);
                  }}
                  className="p-3 bg-[#1A3EEA] hover:bg-[#1534D8] text-white rounded-2xl flex flex-col items-center justify-center text-center transition-colors shadow-glow-blue cursor-pointer"
                >
                  <CreditCard className="w-5 h-5 mb-1" />
                  <span className="text-xs font-bold">Log 2.5K</span>
                </button>
              </div>

              {/* Member Meta Info */}
              <div className="p-4 bg-[#F8FAFC] border border-[#E9ECEF] rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#E9ECEF]">
                  <span className="text-[#64748B]">Admission Fee (Month 1):</span>
                  <span className="font-bold text-[#0F172A]">{formatPKR(member.admission_fee)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E9ECEF]">
                  <span className="text-[#64748B]">Fixed Base Monthly:</span>
                  <span className="font-bold text-[#1A3EEA]">{formatPKR(member.monthly_fee)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E9ECEF]">
                  <span className="text-[#64748B]">Total Collected to Date:</span>
                  <span className="font-black text-[#0F172A]">{formatPKR(totalPaid)}</span>
                </div>
                {member.notes && (
                  <div className="pt-1">
                    <span className="text-[#64748B] block mb-0.5">Notes:</span>
                    <p className="text-[#0F172A] italic bg-white p-2.5 rounded-xl border border-[#E9ECEF]">
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
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center space-x-1.5">
                <Receipt className="w-3.5 h-3.5 text-[#1A3EEA]" />
                <span>PAYMENT HISTORY ({payments.length})</span>
              </h4>
            </div>

            {payments.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#94A3B8]">
                No payment transactions recorded yet.
              </div>
            ) : (
              <div className="space-y-2">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 bg-[#F8FAFC] border border-[#E9ECEF] rounded-2xl flex items-center justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#0F172A]">
                          {p.fee_type === 'FIRST_MONTH_PACKAGE'
                            ? 'Month 1 Package'
                            : 'Monthly Renewal'}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white text-[#64748B] font-semibold border border-[#E9ECEF]">
                          {p.channel}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">
                        {formatDateTime(p.paid_at)}
                        {p.transaction_ref && ` • ${p.transaction_ref}`}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-[#1A3EEA]">
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
          <div className="pt-2 border-t border-[#E9ECEF]">
            <button
              onClick={handleDelete}
              className="w-full h-11 px-3 rounded-2xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer"
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
