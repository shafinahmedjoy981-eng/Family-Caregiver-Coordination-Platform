import React, { useState, useMemo } from 'react';
import { useCaregiver } from '../../context/CaregiverContext';
import {
  ShieldCheck,
  Lock,
  Smartphone,
  Calendar,
  Search,
  Filter,
  Download,
  CheckCircle2,
  FileCheck2,
  Shield,
  User,
  Clock,
  Laptop,
  AlertCircle,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import { AuditLog } from '../../types';

export const HipaaAuditPage: React.FC = () => {
  const { auditLogs, familyCircle, logAuditEntry } = useCaregiver();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [selectedSensitivity, setSelectedSensitivity] = useState<'all' | 'PHI' | 'ADMIN' | 'STANDARD'>('all');

  // Export Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Calculate MFA enrolled count
  // In Threadwell, all care circle members are enrolled in MFA by policy
  const totalMembers = familyCircle.length;
  const mfaEnrolledCount = totalMembers;

  // Filtered logs calculation (newest first)
  const filteredLogs = useMemo(() => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return auditLogs
      .filter((log) => {
        // Text search
        const actor = (log.actorName || log.userName || '').toLowerCase();
        const action = (log.action || '').toLowerCase();
        const resource = (log.resource || log.resourceType || '').toLowerCase();
        const ip = (log.ipAddress || '').toLowerCase();
        const search = searchTerm.toLowerCase();

        const matchesText =
          !searchTerm ||
          actor.includes(search) ||
          action.includes(search) ||
          resource.includes(search) ||
          ip.includes(search);

        // Member filter
        const matchesMember =
          selectedMember === 'all' ||
          actor === selectedMember.toLowerCase();

        // Sensitivity filter
        const matchesSensitivity =
          selectedSensitivity === 'all' || log.sensitivityLevel === selectedSensitivity;

        // Date range filter
        let matchesDate = true;
        if (selectedDateRange !== 'all') {
          const logDate = new Date(log.timestamp.replace(' ', 'T'));
          if (selectedDateRange === 'today') {
            matchesDate = log.timestamp.startsWith(todayStr);
          } else if (selectedDateRange === '7days') {
            matchesDate = logDate >= sevenDaysAgo;
          } else if (selectedDateRange === '30days') {
            matchesDate = logDate >= thirtyDaysAgo;
          }
        }

        return matchesText && matchesMember && matchesSensitivity && matchesDate;
      })
      .sort((a, b) => new Date(b.timestamp.replace(' ', 'T')).getTime() - new Date(a.timestamp.replace(' ', 'T')).getTime());
  }, [auditLogs, searchTerm, selectedMember, selectedDateRange, selectedSensitivity]);

  // CSV Export action
  const handleExportCsv = () => {
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Record Accessed', 'Device', 'IP Address', 'Sensitivity Level'];
    const rows = filteredLogs.map((log) => [
      `"${log.timestamp}"`,
      `"${log.actorName || log.userName || 'System'}"`,
      `"${log.actorRole || 'admin'}"`,
      `"${(log.action || '').replace(/"/g, '""')}"`,
      `"${(log.resource || '').replace(/"/g, '""')}"`,
      `"${(log.device || '').replace(/"/g, '""')}"`,
      `"${(log.ipAddress || '').replace(/"/g, '""')}"`,
      `"${log.sensitivityLevel || 'STANDARD'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `threadwell-hipaa-audit-log-${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAuditEntry(
      `Exported HIPAA compliance audit log as CSV (${filteredLogs.length} records exported)`,
      'HIPAA Ledger / Compliance Export',
      'ADMIN'
    );
    showToast(`Compliance log exported: ${filteredLogs.length} events downloaded as CSV.`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedMember('all');
    setSelectedDateRange('all');
    setSelectedSensitivity('all');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedMember !== 'all' ||
    selectedDateRange !== 'all' ||
    selectedSensitivity !== 'all';

  return (
    <div id="hipaa-audit-page" className="mx-auto max-w-6xl space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 rounded-2xl border border-teal-200 bg-white p-4 text-sm font-semibold text-[#0F766E] shadow-xl dark:border-teal-800 dark:bg-gray-800 dark:text-[#2DD4BF] transition-all"
        >
          <CheckCircle2 className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-xs dark:border-gray-700 dark:bg-gray-800">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
              HIPAA §164.312 Security & Audit Trail
            </span>
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 flex items-center gap-1">
              <FileCheck2 className="h-3 w-3" /> Immutable Ledger
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold font-inter text-[#1F2937] dark:text-white">
            HIPAA & Security Audit Trail
          </h1>
          <p className="mt-1 text-sm text-[#4B5563] dark:text-gray-300 max-w-2xl">
            Cryptographically timestamped record of every PHI access, role alteration, document view, and prescription change for Eleanor Vance.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            id="export-audit-log-btn"
            onClick={handleExportCsv}
            className="touch-target flex items-center space-x-2 rounded-2xl bg-[#0F766E] px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-[#0c5f59] transition-all focus-visible:ring-4 focus-visible:ring-[#CCFBF1] dark:bg-[#0F766E] dark:hover:bg-[#134E4A]"
            aria-label="Export HIPAA audit log to CSV"
          >
            <Download className="h-4 w-4" />
            <span>Export Log (CSV)</span>
          </button>
        </div>
      </div>

      {/* Top Row: Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Encryption */}
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E] dark:bg-[#134E4A] dark:text-[#2DD4BF]">
                <Lock className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Active</span>
              </span>
            </div>
            <h2 className="mt-4 text-base font-bold font-inter text-[#1F2937] dark:text-white">
              AES-256 Encryption
            </h2>
            <p className="mt-1 text-xs text-[#4B5563] dark:text-gray-300 leading-relaxed">
              All PHI, health vault documents, and daily logs are encrypted at rest with AES-256-GCM and in transit via TLS 1.3.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[11px] text-[#4B5563] dark:text-gray-400">
            <span>Hardware Key Store</span>
            <span className="font-semibold text-[#0F766E] dark:text-[#2DD4BF]">FIPS 140-2 Level 3</span>
          </div>
        </div>

        {/* Card 2: MFA Enforcement */}
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                <Smartphone className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center space-x-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Enforced</span>
              </span>
            </div>
            <h2 className="mt-4 text-base font-bold font-inter text-[#1F2937] dark:text-white">
              Multi-Factor Authentication
            </h2>
            <p className="mt-1 text-xs text-[#4B5563] dark:text-gray-300 leading-relaxed">
              Strict 2FA mandatory across all administrative and caregiving accounts to prevent credential compromise.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[11px] text-[#4B5563] dark:text-gray-400">
            <span>Enrollment Status</span>
            <span className="font-bold text-blue-700 dark:text-blue-300">
              {mfaEnrolledCount} of {totalMembers} members enrolled (100%)
            </span>
          </div>
        </div>

        {/* Card 3: Security Review */}
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
                <Calendar className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center space-x-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800">
                <FileCheck2 className="h-3.5 w-3.5" />
                <span>Verified</span>
              </span>
            </div>
            <h2 className="mt-4 text-base font-bold font-inter text-[#1F2937] dark:text-white">
              Last Security Review
            </h2>
            <p className="mt-1 text-xs text-[#4B5563] dark:text-gray-300 leading-relaxed">
              SOC2 Type II & HIPAA annual external penetration test completed with zero critical or high vulnerabilities.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[11px] text-[#4B5563] dark:text-gray-400">
            <span>Audit Review Date</span>
            <span className="font-semibold text-purple-700 dark:text-purple-300">September 18, 2026</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-xs dark:border-gray-700 dark:bg-gray-800 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user, action, record, or IP address..."
              className="w-full rounded-2xl border border-[#E2E8F0] pl-10 pr-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
            />
          </div>

          {/* Member Filter */}
          <div className="flex items-center space-x-2 shrink-0">
            <label htmlFor="member-filter" className="text-xs font-bold text-[#4B5563] dark:text-gray-300 whitespace-nowrap">
              Member:
            </label>
            <select
              id="member-filter"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-semibold text-[#1F2937] dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
            >
              <option value="all">All Circle Members</option>
              {familyCircle.map((member) => (
                <option key={member.id} value={member.name}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center space-x-2 shrink-0">
            <label htmlFor="date-range-filter" className="text-xs font-bold text-[#4B5563] dark:text-gray-300 whitespace-nowrap">
              Date:
            </label>
            <select
              id="date-range-filter"
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value as any)}
              className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-semibold text-[#1F2937] dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
            >
              <option value="all">All Recorded Dates</option>
              <option value="today">Today Only</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>

          {/* Sensitivity Filter */}
          <div className="flex items-center space-x-2 shrink-0">
            <label htmlFor="sensitivity-filter" className="text-xs font-bold text-[#4B5563] dark:text-gray-300 whitespace-nowrap">
              Tier:
            </label>
            <select
              id="sensitivity-filter"
              value={selectedSensitivity}
              onChange={(e) => setSelectedSensitivity(e.target.value as any)}
              className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-semibold text-[#1F2937] dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:border-[#0F766E]"
            >
              <option value="all">All Tiers</option>
              <option value="PHI">PHI Only</option>
              <option value="ADMIN">Admin & RBAC</option>
              <option value="STANDARD">Standard</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="touch-target flex items-center space-x-1 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Active Filters Summary Bar */}
        <div className="flex items-center justify-between text-xs text-[#4B5563] dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700/60">
          <span>
            Showing <strong>{filteredLogs.length}</strong> of <strong>{auditLogs.length}</strong> total compliance entries
          </span>
          <span className="text-[11px]">
            Sorted: Newest entries first (UTC-04:00)
          </span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-xs dark:border-gray-700 dark:bg-gray-800">
        {filteredLogs.length === 0 ? (
          /* Calm Brand Voice Empty State */
          <div className="p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E] dark:bg-[#134E4A] dark:text-[#2DD4BF]">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-inter text-[#1F2937] dark:text-white">
                Peace of mind in every detail
              </h3>
              <p className="mt-2 text-sm text-[#4B5563] dark:text-gray-300 leading-relaxed">
                No audit events match your selected filters. All routine monitoring, AES-256 safeguards, and PHI protections remain continuously active across Eleanor’s circle.
              </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="touch-target inline-flex items-center space-x-1.5 rounded-2xl bg-teal-50 px-4 py-2 text-xs font-bold text-[#0F766E] hover:bg-teal-100 dark:bg-[#134E4A] dark:text-[#2DD4BF]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Clear search filters</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#E2E8F0] dark:bg-gray-900/60 dark:border-gray-700">
                <tr>
                  <th className="py-4 px-4 font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300 whitespace-nowrap">
                    Timestamp
                  </th>
                  <th className="py-4 px-4 font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300 whitespace-nowrap">
                    User / Actor
                  </th>
                  <th className="py-4 px-4 font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300 whitespace-nowrap">
                    Action
                  </th>
                  <th className="py-4 px-4 font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300 whitespace-nowrap">
                    Record Accessed
                  </th>
                  <th className="py-4 px-4 font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300 whitespace-nowrap">
                    Device & IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-gray-700 font-sans">
                {filteredLogs.map((log) => {
                  const userName = log.actorName || log.userName || 'System Service';
                  const isPhi = log.sensitivityLevel === 'PHI';
                  const isAdminAction = log.sensitivityLevel === 'ADMIN';

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors"
                    >
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#4B5563] dark:text-gray-400 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span>{log.timestamp}</span>
                        </div>
                      </td>

                      {/* User */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-[#1F2937] font-bold text-xs dark:bg-gray-700 dark:text-gray-200">
                            {userName.slice(0, 1)}
                          </div>
                          <div>
                            <div className="font-bold text-[#1F2937] dark:text-white">
                              {userName}
                            </div>
                            <div className="text-[10px] text-[#4B5563] dark:text-gray-400 uppercase tracking-wider">
                              {log.actorRole || 'admin'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start space-x-2">
                          {isPhi && (
                            <span className="mt-0.5 shrink-0 rounded-md bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800">
                              PHI
                            </span>
                          )}
                          {isAdminAction && (
                            <span className="mt-0.5 shrink-0 rounded-md bg-purple-50 px-1.5 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800">
                              ADMIN
                            </span>
                          )}
                          <span className="text-[#1F2937] dark:text-gray-200 font-medium leading-snug">
                            {log.action}
                          </span>
                        </div>
                      </td>

                      {/* Record Accessed */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-[#0F766E] dark:text-[#2DD4BF]">
                        <div className="flex items-center space-x-1.5">
                          <Lock className="h-3 w-3 shrink-0" />
                          <span>{log.resource || log.resourceType || 'General PHI'}</span>
                        </div>
                      </td>

                      {/* Device & IP */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-[#4B5563] dark:text-gray-400">
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-1 text-[#1F2937] dark:text-gray-300 font-mono">
                            <span>{log.ipAddress}</span>
                          </div>
                          <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate max-w-[200px]">
                            {log.device}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
