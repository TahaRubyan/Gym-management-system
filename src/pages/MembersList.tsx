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
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#7fb6ac] uppercase tracking-wider">
            ROSTER DIRECTORY
          </span>
          <h2 className="text-xl font-bold text-[#9ba9c2] tracking-tight">Members</h2>
        </div>

        <button
          onClick={onAddNew}
          className="h-10 px-3.5 rounded-xl bg-[#7fb6ac] hover:bg-[#70a59b] text-[#0c1012] text-xs font-mono font-bold flex items-center space-x-1.5 transition-all active:scale-95 shadow-glow-mint cursor-pointer"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Member</span>
        </button>
      </div>

      {/* 50px Search Bar (Figma Prototyping Kit Spec) */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by full name or mobile phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-[50px] bg-[#182023] border border-[#2a3639] focus:border-[#7fb6ac] rounded-2xl pl-11 pr-10 text-sm text-[#9ba9c2] placeholder-[#6c7674] focus:outline-none transition-colors shadow-sm font-sans"
        />
        <Search className="w-4 h-4 text-[#6c7674] absolute left-4 top-1/2 -translate-y-1/2" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#6c7674] hover:text-[#9ba9c2] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Segmented Filter Pills (Figma Prototyping Kit Spec) */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        {filterOptions.map((opt) => {
          const isSelected = activeFilter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setActiveFilter(opt.id)}
              className={`h-9 px-3.5 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 border active:scale-95 cursor-pointer ${
                isSelected
                  ? 'bg-[#1f282c] border-[#7fb6ac] text-[#9ba9c2] shadow-sm'
                  : 'bg-[#182023] border-[#2a3639] text-[#67758d] hover:border-[#6c7674]'
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-[#7fb6ac] text-[#0c1012] font-black'
                    : 'bg-[#13191b] text-[#67758d]'
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
        <div className="text-center py-14 px-4 bg-[#182023] border border-[#2a3639] rounded-2xl space-y-2.5">
          <div className="w-12 h-12 rounded-xl bg-[#13191b] text-[#6c7674] flex items-center justify-center mx-auto border border-[#2a3639]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#9ba9c2]">No members found</h3>
            <p className="text-xs text-[#6c7674] mt-1 max-w-xs mx-auto">
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
              className="text-xs text-[#7fb6ac] font-bold font-mono underline underline-offset-4 cursor-pointer"
            >
              Clear Search & Filter
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMembers.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.02 }}
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
