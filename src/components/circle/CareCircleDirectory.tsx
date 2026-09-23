import React, { useState } from 'react';
import { useCaregiver } from '../../context/CaregiverContext';
import {
  Users,
  Shield,
  UserPlus,
  Mail,
  Phone,
  CheckCircle2,
  Lock,
  Eye,
  Edit,
  Clock,
  HeartHandshake,
  User,
} from 'lucide-react';
import { CircleMember, UserRole } from '../../types';

export const CareCircleDirectory: React.FC = () => {
  const { familyCircle, inviteMember, currentUser, canEdit } = useCaregiver();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRelationship, setInviteRelationship] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('contributor');

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Primary Admin (POA)',
          color: 'bg-teal-50 text-[#0F766E] border-teal-200 dark:bg-teal-950/40 dark:text-[#2DD4BF] dark:border-teal-800',
          desc: 'Full access: edit profile, assign tasks, access legal/financial docs, manage circle.',
        };
      case 'contributor':
        return {
          label: 'Family Contributor',
          color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
          desc: 'Can claim tasks, log medication doses, post updates, and view care schedules.',
        };
      case 'viewer':
        return {
          label: 'View-Only (Extended Family)',
          color: 'bg-gray-100 text-[#4B5563] border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
          desc: 'Can see calm timeline and high-level updates. Cannot view sensitive PHI or legal docs.',
        };
      case 'aide':
        return {
          label: 'Shift-Scoped Care Aide',
          color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
          desc: 'Access strictly limited to active shift hours: daily routine, dietary needs, shift tasks.',
        };
      case 'senior':
        return {
          label: 'Care Recipient',
          color: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
          desc: 'Empowered, dignified access through voice-first, large-print interface.',
        };
    }
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    inviteMember({
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      phone: invitePhone.trim() || '(555) 000-0000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      relationship: inviteRelationship.trim() || 'Family Member',
      role: inviteRole,
    });

    setIsInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
    setInvitePhone('');
    setInviteRelationship('');
  };

  return (
    <div id="care-circle-directory-view" className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
              Care Circle & Permissions
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold font-inter text-[#1F2937] dark:text-white">
            Mom’s Support Network
          </h1>
          <p className="mt-1 text-sm text-[#4B5563] dark:text-gray-300">
            Granular role-based permissions ensure everyone helps without compromising privacy.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsInviteOpen(true)}
            className="touch-target flex items-center space-x-2 rounded-2xl bg-[#0F766E] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#0c5f59]"
          >
            <UserPlus className="h-4 w-4" />
            <span>Invite to Circle</span>
          </button>
        )}
      </div>

      {/* RBAC Overview Card */}
      <div className="rounded-3xl border border-[#E2E8F0] bg-[#FAF8F5] p-6 dark:border-gray-700 dark:bg-gray-800/60">
        <h2 className="text-base font-bold font-inter text-[#1F2937] dark:text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF]" />
          Role-Based Access Control Architecture
        </h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {(['admin', 'contributor', 'viewer', 'aide'] as UserRole[]).map((role) => {
            const b = getRoleBadge(role);
            return (
              <div
                key={role}
                className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <span className={`inline-block rounded-md px-2 py-0.5 font-bold border ${b.color}`}>
                  {b.label}
                </span>
                <p className="mt-2 text-[#4B5563] dark:text-gray-300 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Circle Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {familyCircle.map((member) => {
          const badge = getRoleBadge(member.role);
          const isCurrent = member.id === currentUser.id;

          return (
            <div
              key={member.id}
              className={`rounded-3xl border p-6 shadow-xs flex flex-col justify-between ${
                isCurrent
                  ? 'border-[#0F766E]/40 bg-white ring-2 ring-[#CCFBF1] dark:bg-gray-800 dark:ring-[#134E4A]'
                  : 'border-[#E2E8F0] bg-white dark:border-gray-700 dark:bg-gray-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3.5">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-[#0F766E]"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-[#0F766E] font-bold text-base dark:bg-[#134E4A] dark:text-[#99F6E4]">
                        {member.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-bold font-inter text-[#1F2937] dark:text-white">
                          {member.name}
                        </h2>
                        {isCurrent && (
                          <span className="rounded-full bg-[#CCFBF1] px-2 py-0.5 text-[10px] font-bold text-[#0F766E] dark:bg-[#134E4A] dark:text-[#99F6E4]">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#4B5563] dark:text-gray-300">
                        {member.relationship}
                      </p>
                    </div>
                  </div>

                  <span className={`rounded-lg px-2.5 py-1 text-xs font-bold border ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-[#4B5563] dark:text-gray-300">
                  <p className="flex items-center space-x-2">
                    <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span>{member.email}</span>
                  </p>
                  {member.phone && (
                    <p className="flex items-center space-x-2">
                      <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <span>{member.phone}</span>
                    </p>
                  )}
                </div>

                <p className="mt-3 text-xs text-[#6B9080] dark:text-[#99F6E4] bg-[#FAF8F5] p-2.5 rounded-xl border border-gray-100 dark:bg-gray-700/50 dark:border-gray-700">
                  {badge.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E2E8F0] dark:border-gray-700 flex items-center justify-between text-xs text-[#4B5563] dark:text-gray-400">
                <span>Joined {member.joinedDate}</span>
                {member.phone && (
                  <a
                    href={`tel:${member.phone.replace(/[^0-9]/g, '')}`}
                    className="touch-target font-bold text-[#0F766E] hover:underline dark:text-[#2DD4BF]"
                  >
                    Call
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-bold font-inter text-[#1F2937] dark:text-white">
              Invite Family Member or Care Aide
            </h2>
            <form onSubmit={handleInviteSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Uncle Robert Vance"
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="robert@example.com"
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={inviteRelationship}
                    onChange={(e) => setInviteRelationship(e.target.value)}
                    placeholder="e.g. Brother / Visiting Nurse"
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                    Access Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as UserRole)}
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="contributor">Contributor (Can claim tasks & log)</option>
                    <option value="viewer">Viewer (View-only updates)</option>
                    <option value="aide">Care Aide (Shift-scoped)</option>
                    <option value="admin">Admin (Full legal POA level)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="touch-target rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-bold text-[#4B5563] dark:border-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target rounded-xl bg-[#0F766E] px-5 py-2 text-sm font-bold text-white shadow-xs hover:bg-[#0c5f59]"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
