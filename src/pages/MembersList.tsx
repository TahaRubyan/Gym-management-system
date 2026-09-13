import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, X, Users, UserPlus } from 'lucide-react';
import { Member, MembershipFilter } from '../types/gym';
import { checkMembershipStatus, normalizePakistaniPhone } from '../utils/dateAndPhone';
import { MemberCard } from '../components/MemberCard';

interface MembersListProps {
  members: Member[];
  onLogFee: (member: Member) => void;
  onSelectMember: (member: Member) => void;
  onAddNew: () => void;
  onWhatsAppSent: (member: Member) => void;
  sentReminderMemberIds: Set<string>;
}

export const MembersList: React.FC<MembersListProps> = ({
  members,
  onLogFee,
  onSelectMember,
  onAddNew,
  onWhatsAppSent,
  sentReminderMemberIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<MembershipFilter>('ALL');

  // Filter & Search Logic
  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const cleanQueryPhone = query.replace(/\D/g, '');

    return members.filter((member) => {
      // 1. Status Filter
      const { status } = checkMembershipStatus(member.expiry_date);
      if (activeFilter === 'ACTIVE' && status !== 'ACTIVE') return false;
      if (activeFilter === 'EXPIRING_SOON' && status !== 'EXPIRING_SOON') return false;
      if (activeFilter === 'EXPIRED' && status !== 'EXPIRED') return false;

      // 2. Search Query (Name or Phone)
      if (!query) return true;

      const nameMatch = member.full_name.toLowerCase().includes(query);
      const memberPhoneClean = normalizePakistaniPhone(member.phone);
      const phoneMatch =
        cleanQueryPhone.length > 0 &&
        (member.phone.includes(query) || memberPhoneClean.includes(cleanQueryPhone));

      return nameMatch || phoneMatch;
    });
  }, [members, searchQuery, activeFilter]);

  // Status Counts for Pill Badges
  const counts = useMemo(() => {
    let active = 0;
    let expiring = 0;
    let expired = 0;

    for (const m of members) {
      const { status } = checkMembershipStatus(m.expiry_date);
      if (status === 'ACTIVE') active++;
      else if (status === 'EXPIRING_SOON') expiring++;
      else if (status === 'EXPIRED') expired++;
    }

    return {
      all: members.length,
      active,
      expiring,
      expired,
    };
  }, [members]);

  const filterOptions: { id: MembershipFilter; label: string; count: number }[] = [
    { id: 'ALL', label: 'All', count: counts.all },
    { id: 'ACTIVE', label: 'Active', count: counts.active },
    { id: 'EXPIRING_SOON', label: 'Expiring', count: counts.expiring },
    { id: 'EXPIRED', label: 'Expired', count: counts.expired },
  ];

  return (
    <div className="space-y-3.5 pb-28 px-4 pt-2 max-w-md mx-auto select-none">
      {/* Header & Quick Add */}
      <div className="flex items-center justify-between pt-1">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-[#1A3EEA] uppercase tracking-wider block">
            ROSTER DIRECTORY
          </span>
          <h2 className="text-2xl font-black text-[#0F172A] tracking-normal">Members</h2>
        </div>

        <button
          onClick={onAddNew}
          className="h-11 px-4 rounded-2xl bg-[#1A3EEA] hover:bg-[#1534D8] text-white text-xs font-bold flex items-center space-x-2 transition-all active:scale-95 shadow-glow-blue tracking-wide cursor-pointer"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Member</span>
        </button>
      </div>

      {/* 52px Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by name or mobile number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-[52px] bg-white border border-[#E9ECEF] focus:border-[#1A3EEA] rounded-2xl pl-12 pr-10 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none transition-colors shadow-apple-card font-sans tracking-wide"
        />
        <Search className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Segmented Filter Pills */}
      <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {filterOptions.map((opt) => {
          const isSelected = activeFilter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setActiveFilter(opt.id)}
              className={`h-9 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 border active:scale-95 cursor-pointer tracking-wide ${
                isSelected
                  ? 'bg-[#1A3EEA] border-[#1A3EEA] text-white shadow-sm font-bold'
                  : 'bg-[#F1F5F9] border-[#E2E8F0] text-[#64748B] hover:border-[#1A3EEA]/30'
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-white text-[#1A3EEA] font-black'
                    : 'bg-white text-[#64748B] font-semibold'
                }`}
              >
                {opt.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Members Streamlined Roster List */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-14 px-4 bg-white border border-[#E9ECEF] rounded-3xl shadow-apple-card space-y-2.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF1FF] text-[#1A3EEA] flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">No members found</h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-xs mx-auto">
              {searchQuery
                ? `No roster records match "${searchQuery}".`
                : 'No members match this filter criteria.'}
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('ALL');
              }}
              className="text-xs text-[#1A3EEA] font-bold underline underline-offset-4 cursor-pointer"
            >
              Clear Search & Filter
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredMembers.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10px' }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
            >
              <MemberCard
                member={member}
                onLogFee={onLogFee}
                onSelectMember={onSelectMember}
                onWhatsAppSent={onWhatsAppSent}
                reminderSent={sentReminderMemberIds.has(member.id)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
