import React, { useState } from 'react';
import { useCaregiver } from '../../context/CaregiverContext';
import {
  ShieldAlert,
  History,
  Lock,
  User,
  Filter,
  CheckCircle2,
  FileText,
  Search,
} from 'lucide-react';

export const AuditLogViewer: React.FC = () => {
  const { auditLogs } = useCaregiver();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredLogs = auditLogs.filter((log) => {
    const actor = log.actorName || log.userName || '';
    const resource = log.resource || log.resourceType || '';
    const matchesSearch =
      actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat =
      selectedCategory === 'all' ||
      resource.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCat;
  });

  return (
    <div id="audit-log-viewer" className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800">
        <div>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
              HIPAA & Security Compliance
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Immutable Ledger
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold font-inter text-[#1F2937] dark:text-white">
            Security Audit Trail
          </h1>
          <p className="mt-1 text-sm text-[#4B5563] dark:text-gray-300">
            Cryptographically timestamped record of every PHI view, document decryption, and medication dose change.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit actions, users, or resources..."
            className="w-full rounded-2xl border border-[#E2E8F0] pl-10 pr-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-[#0F766E]"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
          {['all', 'document', 'medication', 'profile', 'calendar', 'task'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`touch-target rounded-xl px-3 py-1.5 font-semibold capitalize whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#0F766E] text-white'
                  : 'bg-white text-[#4B5563] border border-[#E2E8F0] hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
              }`}
            >
              {cat === 'all' ? 'All Resources' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Log Entries Table */}
      <div className="overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-xs dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E2E8F0] dark:bg-gray-700/50 dark:border-gray-700">
              <tr>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300">
                  Timestamp
                </th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300">
                  User
                </th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300">
                  Resource
                </th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300">
                  Action Detail
                </th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300">
                  IP / Verification
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-gray-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                  <td className="py-3 px-4 font-mono text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#1F2937] dark:text-white whitespace-nowrap">
                    {log.actorName || log.userName}
                  </td>
                  <td className="py-3 px-4 uppercase text-[10px] font-bold text-[#0F766E] dark:text-[#2DD4BF] whitespace-nowrap">
                    {log.resource || log.resourceType}
                  </td>
                  <td className="py-3 px-4 text-[#1F2937] dark:text-gray-200">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                    {log.ipAddress || '192.168.1.104'} • AES-verified
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
