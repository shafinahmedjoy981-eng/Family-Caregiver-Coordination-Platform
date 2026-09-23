import React, { useState } from 'react';
import { useCaregiver } from '../../context/CaregiverContext';
import {
  Shield,
  UserPlus,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserX,
  UserCheck,
  Lock,
  ChevronDown,
  X,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { UserRole } from '../../types';

export const CircleRbacManager: React.FC = () => {
  const {
    familyCircle,
    currentUser,
    isAdmin,
    inviteMember,
    updateMemberRole,
    removeMember,
  } = useCaregiver();

  // Invite Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRelationship, setInviteRelationship] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('contributor');
  const [inviteShiftHours, setInviteShiftHours] = useState('');
  const [invitePhone, setInvitePhone] = useState('');

  // Role Change Modal State
  const [memberToChangeRole, setMemberToChangeRole] = useState<{
    id: string;
    name: string;
    currentRole: UserRole;
  } | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState<UserRole>('contributor');

  // Removal Confirmation Modal State
  const [memberToRemove, setMemberToRemove] = useState<{
    id: string;
    name: string;
    email: string;
    role: UserRole;
  } | null>(null);

  // Success toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const getRoleMeta = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin (POA)',
          badgeColor:
            'bg-teal-50 text-[#0F766E] border-teal-200 dark:bg-teal-950/50 dark:text-[#2DD4BF] dark:border-teal-800',
          description:
            'Full administrative authority: edit clinical profile, legal/financial vault docs, grant/revoke permissions, and manage billing.',
        };
      case 'contributor':
        return {
          label: 'Contributor',
          badgeColor:
            'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
          description:
            'Active care partner: claim tasks, schedule rides, log medication doses, and participate in care threads.',
        };
      case 'viewer':
        return {
          label: 'View-only',
          badgeColor:
            'bg-gray-100 text-[#4B5563] border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
          description:
            'Extended family & friends: access calm updates and timeline notices. Zero access to legal, financial, or sensitive PHI records.',
        };
      case 'aide':
        return {
          label: 'Professional Caregiver — Shift-scoped',
          badgeColor:
            'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
          description:
            'Visiting aide or clinician: access is strictly constrained to designated on-duty shift windows, daily routine notes, and shift tasks.',
        };
      case 'senior':
        return {
          label: 'Care Recipient (Senior)',
          badgeColor:
            'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
          description:
            'Empowered, dignified voice-first senior interface with high-legibility calendar and simple daily checklists.',
        };
      default:
        return {
          label: role,
          badgeColor:
            'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300',
          description: 'Standard care circle member.',
        };
    }
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    inviteMember({
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      phone: invitePhone.trim() || '(555) 234-5678',
      relationship: inviteRelationship.trim() || 'Care Circle Member',
      role: inviteRole,
      shiftHours:
        inviteRole === 'aide'
          ? inviteShiftHours.trim() || 'Mon, Wed, Fri 9:00 AM – 1:00 PM'
          : undefined,
      onDuty: inviteRole === 'aide' ? true : undefined,
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    });

    showToast(`Invitation sent to ${inviteEmail.trim()}. Access is provisioned under ${getRoleMeta(inviteRole).label}.`);
    setIsInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
    setInviteRelationship('');
    setInviteRole('contributor');
    setInviteShiftHours('');
    setInvitePhone('');
  };

  const handleRoleChangeConfirm = () => {
    if (!memberToChangeRole) return;
    updateMemberRole(memberToChangeRole.id, selectedNewRole);
    showToast(`Updated ${memberToChangeRole.name}’s role to ${getRoleMeta(selectedNewRole).label}. Event logged to HIPAA ledger.`);
    setMemberToChangeRole(null);
  };

  const handleRemovalConfirm = () => {
    if (!memberToRemove) return;
    removeMember(memberToRemove.id);
    showToast(`Removed ${memberToRemove.name} from circle. Access revoked immediately and logged to HIPAA audit ledger.`);
    setMemberToRemove(null);
  };

  return (
    <div id="circle-rbac-page" className="mx-auto max-w-6xl space-y-6">
      {/* Toast notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 rounded-2xl border border-teal-200 bg-white p-4 text-sm font-semibold text-[#0F766E] shadow-xl dark:border-teal-800 dark:bg-gray-800 dark:text-[#2DD4BF] transition-all animate-fadeIn"
        >
          <CheckCircle2 className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-xs dark:border-gray-700 dark:bg-gray-800">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
              Care Circle Governance & RBAC
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold font-inter text-[#1F2937] dark:text-white">
            Circle & Role-Based Access Control
          </h1>
          <p className="mt-1 text-sm text-[#4B5563] dark:text-gray-300 max-w-2xl">
            Empower trusted family and professional aides while protecting Eleanor’s legal documents, financial records, and sensitive health information.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            id="invite-member-btn"
            onClick={() => setIsInviteOpen(true)}
            className="touch-target flex items-center space-x-2 rounded-2xl bg-[#0F766E] px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-[#0c5f59] transition-all focus-visible:ring-4 focus-visible:ring-[#CCFBF1] dark:bg-[#0F766E] dark:hover:bg-[#134E4A]"
            aria-label="Invite new member to care circle"
          >
            <UserPlus className="h-4 w-4" />
            <span>Invite Member</span>
          </button>
        </div>
      </div>

      {/* Admin Status Notice */}
      {!isAdmin ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs sm:text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200 flex items-start space-x-3">
          <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Viewing with {getRoleMeta(currentUser.role).label} permissions:</span> You can view circle members and shift windows. Modifying member roles or revoking circle membership requires Primary Admin (POA) credentials.
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-teal-200/80 bg-teal-50/60 p-4 text-xs sm:text-sm text-[#0F766E] dark:border-teal-800 dark:bg-teal-950/30 dark:text-[#99F6E4] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Lock className="h-4 w-4 shrink-0 text-[#0F766E] dark:text-[#2DD4BF]" />
            <span>
              <strong className="font-bold">Admin Controls Active:</strong> You have verified Healthcare Proxy & Primary Admin authority to govern Eleanor’s care circle.
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white dark:bg-gray-800 border border-teal-200 dark:border-teal-700 shrink-0">
            {familyCircle.length} Active Members
          </span>
        </div>
      )}

      {/* Role Architecture Explainer Cards */}
      <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold font-inter text-[#1F2937] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#0F766E] dark:text-[#2DD4BF]" />
            Security & RBAC Tier Definitions
          </h2>
          <span className="text-xs text-[#4B5563] dark:text-gray-400">
            HIPAA §164.312 Minimum Necessary Standard
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {(['admin', 'contributor', 'viewer', 'aide'] as UserRole[]).map((role) => {
            const meta = getRoleMeta(role);
            const count = familyCircle.filter((m) => m.role === role).length;
            return (
              <div
                key={role}
                className="rounded-2xl border border-[#E2E8F0] bg-[#FAF8F5] p-4 dark:border-gray-700 dark:bg-gray-900/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-bold border ${meta.badgeColor}`}>
                      {meta.label}
                    </span>
                    <span className="text-xs font-semibold text-[#4B5563] dark:text-gray-400">
                      {count} {count === 1 ? 'member' : 'members'}
                    </span>
                  </div>
                  <p className="mt-2.5 text-xs text-[#4B5563] dark:text-gray-300 leading-relaxed">
                    {meta.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Circle Members List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold font-inter text-[#1F2937] dark:text-white">
            Current Members in Eleanor’s Circle ({familyCircle.length})
          </h2>
          <span className="text-xs text-[#4B5563] dark:text-gray-400">
            All role alterations are recorded to the HIPAA audit ledger
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {familyCircle.map((member) => {
            const meta = getRoleMeta(member.role);
            const isCurrentUserCard = member.id === currentUser.id;
            const isSenior = member.role === 'senior';

            return (
              <div
                key={member.id}
                className={`rounded-2xl sm:rounded-3xl border p-5 sm:p-6 transition-all duration-200 ${
                  isCurrentUserCard
                    ? 'border-[#0F766E]/50 bg-white ring-1 ring-[#0F766E]/20 dark:border-teal-600/50 dark:bg-gray-800'
                    : 'border-[#E2E8F0] bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
                } shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-5`}
              >
                {/* Member Identity & Relationship */}
                <div className="flex items-start sm:items-center space-x-4">
                  <div className="relative shrink-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-14 w-14 rounded-2xl object-cover ring-2 ring-[#0F766E]/20"
                    />
                    {isCurrentUserCard && (
                      <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0F766E] text-[10px] font-bold text-white shadow-xs">
                        You
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold font-inter text-[#1F2937] dark:text-white">
                        {member.name}
                      </h3>
                      {isCurrentUserCard && (
                        <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-semibold text-[#0F766E] dark:bg-teal-900/60 dark:text-teal-200">
                          Active Session
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-medium text-[#4B5563] dark:text-gray-300">
                      {member.relationship}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5 text-xs text-[#4B5563] dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {member.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {member.phone}
                      </span>
                    </div>

                    {/* Shift hours for professional aides */}
                    {member.shiftHours && (
                      <div className="mt-1.5 flex items-center space-x-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-xl w-fit border border-purple-200/60 dark:border-purple-800">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span>Shift Window: {member.shiftHours}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Role Badge & Admin Action Buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700">
                  <div className="text-left sm:text-right">
                    <span className={`inline-block rounded-xl px-3 py-1.5 text-xs font-bold border ${meta.badgeColor}`}>
                      {meta.label}
                    </span>
                  </div>

                  {/* Admin-only controls */}
                  {isAdmin && !isSenior && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setMemberToChangeRole({
                            id: member.id,
                            name: member.name,
                            currentRole: member.role,
                          });
                          setSelectedNewRole(member.role);
                        }}
                        className="touch-target flex items-center space-x-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-semibold text-[#1F2937] hover:bg-gray-50 hover:border-[#0F766E] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-teal-500 transition-colors"
                        aria-label={`Change role for ${member.name}`}
                      >
                        <UserCheck className="h-3.5 w-3.5 text-[#0F766E] dark:text-[#2DD4BF]" />
                        <span>Change Role</span>
                      </button>

                      {!isCurrentUserCard && (
                        <button
                          onClick={() =>
                            setMemberToRemove({
                              id: member.id,
                              name: member.name,
                              email: member.email,
                              role: member.role,
                            })
                          }
                          className="touch-target flex items-center space-x-1.5 rounded-xl border border-red-200 bg-red-50/60 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 hover:border-red-300 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-900/50 transition-colors"
                          aria-label={`Remove ${member.name} from care circle`}
                        >
                          <UserX className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invite Member Email Flow Modal */}
      {isInviteOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="invite-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto"
        >
          <div className="relative w-full max-w-lg rounded-3xl border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-2xl dark:border-gray-700 dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF]" />
                <h2 id="invite-modal-title" className="text-xl font-bold font-inter text-[#1F2937] dark:text-white">
                  Invite Member to Circle
                </h2>
              </div>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="touch-target rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close invite modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g., Jonathan Vance, RN"
                  className="mt-1.5 w-full rounded-2xl border border-[#E2E8F0] px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300">
                  Email Address (Invite destination) *
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@family.com or agency@care.com"
                  className="mt-1.5 w-full rounded-2xl border border-[#E2E8F0] px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300">
                    Relationship to Eleanor
                  </label>
                  <input
                    type="text"
                    value={inviteRelationship}
                    onChange={(e) => setInviteRelationship(e.target.value)}
                    placeholder="e.g. Grandson, Physical Therapist"
                    className="mt-1.5 w-full rounded-2xl border border-[#E2E8F0] px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="mt-1.5 w-full rounded-2xl border border-[#E2E8F0] px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300">
                  Select RBAC Role *
                </label>
                <div className="mt-2 space-y-2">
                  {(['admin', 'contributor', 'viewer', 'aide'] as UserRole[]).map((role) => {
                    const meta = getRoleMeta(role);
                    return (
                      <label
                        key={role}
                        className={`flex items-start space-x-3 rounded-2xl border p-3.5 cursor-pointer transition-all ${
                          inviteRole === role
                            ? 'border-[#0F766E] bg-teal-50/50 dark:border-teal-500 dark:bg-teal-950/40'
                            : 'border-[#E2E8F0] bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                        }`}
                      >
                        <input
                          type="radio"
                          name="inviteRole"
                          value={role}
                          checked={inviteRole === role}
                          onChange={() => setInviteRole(role)}
                          className="mt-1 text-[#0F766E] focus:ring-[#0F766E]"
                        />
                        <div>
                          <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-bold border ${meta.badgeColor}`}>
                            {meta.label}
                          </span>
                          <p className="mt-1 text-xs text-[#4B5563] dark:text-gray-300">
                            {meta.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {inviteRole === 'aide' && (
                <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-800 dark:bg-purple-950/30">
                  <label className="block text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-200">
                    Shift-Scoped Window Hours
                  </label>
                  <input
                    type="text"
                    value={inviteShiftHours}
                    onChange={(e) => setInviteShiftHours(e.target.value)}
                    placeholder="e.g. Mon, Wed, Fri 9:00 AM – 1:00 PM"
                    className="mt-1.5 w-full rounded-2xl border border-purple-200 bg-white px-4 py-2 text-sm dark:border-purple-700 dark:bg-gray-800 dark:text-white"
                  />
                  <p className="mt-1 text-[11px] text-purple-700 dark:text-purple-300">
                    Access automatically activates during these hours and is locked outside active shifts.
                  </p>
                </div>
              )}

              <div className="mt-6 flex items-center justify-end space-x-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="touch-target rounded-2xl px-5 py-2.5 text-sm font-semibold text-[#4B5563] hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target flex items-center space-x-2 rounded-2xl bg-[#0F766E] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#0c5f59]"
                >
                  <Mail className="h-4 w-4" />
                  <span>Send Secure Invitation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Role Modal */}
      {memberToChangeRole && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="role-change-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
        >
          <div className="relative w-full max-w-md rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF]" />
                <h2 id="role-change-title" className="text-lg font-bold font-inter text-[#1F2937] dark:text-white">
                  Modify Role: {memberToChangeRole.name}
                </h2>
              </div>
              <button
                onClick={() => setMemberToChangeRole(null)}
                className="touch-target rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-xs text-[#4B5563] dark:text-gray-300 leading-relaxed">
              Select the new security permission tier for <strong>{memberToChangeRole.name}</strong>. This update takes effect immediately and writes to the immutable HIPAA log.
            </p>

            <div className="mt-4 space-y-2.5">
              {(['admin', 'contributor', 'viewer', 'aide'] as UserRole[]).map((role) => {
                const meta = getRoleMeta(role);
                const isSelected = selectedNewRole === role;
                return (
                  <div
                    key={role}
                    onClick={() => setSelectedNewRole(role)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0F766E] bg-teal-50/50 ring-1 ring-[#0F766E] dark:border-teal-500 dark:bg-teal-950/40'
                        : 'border-[#E2E8F0] bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`rounded-md px-2 py-0.5 text-xs font-bold border ${meta.badgeColor}`}>
                        {meta.label}
                      </span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-[#0F766E] dark:text-[#2DD4BF]" />}
                    </div>
                    <p className="mt-1 text-[11px] text-[#4B5563] dark:text-gray-300">
                      {meta.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setMemberToChangeRole(null)}
                className="touch-target rounded-2xl px-4 py-2 text-xs font-semibold text-[#4B5563] hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRoleChangeConfirm}
                className="touch-target rounded-2xl bg-[#0F766E] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0c5f59]"
              >
                Save Role Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revocation / Removal Confirmation Dialog */}
      {memberToRemove && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="removal-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
        >
          <div className="relative w-full max-w-md rounded-3xl border border-red-200 bg-white p-6 shadow-2xl dark:border-red-900/60 dark:bg-gray-900">
            <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/60">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h2 id="removal-dialog-title" className="text-lg font-bold font-inter text-[#1F2937] dark:text-white">
                  Revoke Circle Access?
                </h2>
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                  Immediate credential revocation
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-red-50 p-4 dark:bg-red-950/30 text-xs text-red-800 dark:text-red-200 space-y-2">
              <p>
                Are you sure you want to remove <strong>{memberToRemove.name}</strong> ({memberToRemove.email}) from Eleanor’s circle?
              </p>
              <p className="font-semibold">
                • All active login sessions will be immediately terminated.
                <br />
                • Access to medications, vault docs, and care calendar will be cut off.
                <br />
                • This security event will be permanently written to the immutable HIPAA audit log.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setMemberToRemove(null)}
                className="touch-target rounded-2xl px-4 py-2 text-xs font-semibold text-[#4B5563] hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Keep Member
              </button>
              <button
                type="button"
                onClick={handleRemovalConfirm}
                className="touch-target rounded-2xl bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700 focus-visible:ring-4 focus-visible:ring-red-200"
              >
                Confirm Removal & Revoke Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
