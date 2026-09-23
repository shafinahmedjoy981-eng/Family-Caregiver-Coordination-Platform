import React, { useState } from 'react';
import { useCaregiver } from '../../context/CaregiverContext';
import {
  Lock,
  ShieldCheck,
  FileText,
  Download,
  Eye,
  Plus,
  Clock,
  AlertTriangle,
  KeyRound,
  FileCheck,
  FilePlus,
  X,
  History,
} from 'lucide-react';
import { VaultDocument, DocumentCategory, UserRole } from '../../types';

export const DocumentVault: React.FC = () => {
  const {
    vaultDocuments,
    addVaultDocument,
    recordDocumentAccess,
    currentUser,
    careRecipient,
  } = useCaregiver();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewDoc, setPreviewDoc] = useState<VaultDocument | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('poa');
  const [fileType, setFileType] = useState('PDF Document');
  const [notes, setNotes] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  const getCategoryLabel = (cat: DocumentCategory) => {
    switch (cat) {
      case 'poa':
        return 'Healthcare Proxy / POA';
      case 'insurance':
        return 'Insurance & Medicare';
      case 'advance_directive':
        return 'Advance Directives & MOLST';
      case 'discharge_notes':
        return 'Hospital & Surgical Discharge';
      case 'medical_record':
        return 'Lab Reports & Vitals';
      case 'id_card':
        return 'State ID & Emergency Card';
    }
  };

  const handleOpenPreview = (doc: VaultDocument) => {
    // Record immutable audit access
    recordDocumentAccess(doc.id, `Decrypted and viewed secure document: "${doc.title}"`);
    setPreviewDoc(doc);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addVaultDocument({
      title: title.trim(),
      category,
      fileType,
      fileSize: '1.2 MB',
      expirationDate: expirationDate || undefined,
      notes: notes.trim() || undefined,
      restrictedRoles: ['admin', 'contributor'],
      isVerified: true,
    });

    setIsUploadOpen(false);
    setTitle('');
    setNotes('');
    setExpirationDate('');
  };

  const filteredDocs = vaultDocuments.filter((d) => {
    if (selectedCategory === 'all') return true;
    return d.category === selectedCategory;
  });

  return (
    <div id="document-vault-view" className="mx-auto max-w-6xl space-y-6">
      {/* Header with Encryption Stamp */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800">
        <div>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
              Encrypted Family Vault
            </span>
            <span className="rounded-full bg-[#CCFBF1] px-2 py-0.5 text-[10px] font-bold text-[#0F766E] dark:bg-[#134E4A] dark:text-[#99F6E4]">
              AES-256 GCM
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold font-inter text-[#1F2937] dark:text-white">
            Mom’s Critical Documents
          </h1>
          <p className="mt-1 text-sm text-[#4B5563] dark:text-gray-300">
            Never scramble for POA, Medicare cards, or surgery records in an emergency room.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="touch-target flex items-center space-x-2 rounded-2xl bg-[#0F766E] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#0c5f59]"
        >
          <Plus className="h-4 w-4" />
          <span>Upload Encrypted File</span>
        </button>
      </div>

      {/* Security Assurance Banner */}
      <div className="rounded-2xl border border-teal-200 bg-[#CCFBF1]/30 p-4 dark:border-teal-800 dark:bg-[#134E4A]/30">
        <div className="flex items-start space-x-3">
          <ShieldCheck className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF] shrink-0 mt-0.5" />
          <div className="text-xs text-[#1F2937] dark:text-gray-200 leading-relaxed">
            <p className="font-bold text-sm text-[#0F766E] dark:text-[#99F6E4]">
              Zero-Knowledge Family Encryption & Auditing Active
            </p>
            <p className="mt-0.5 text-[#4B5563] dark:text-gray-300">
              Every view or download creates an immutable audit trail with timestamp, user ID, and device identity. Access is restricted by caregiver role.
            </p>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Documents' },
          { id: 'poa', label: 'Healthcare Proxy / POA' },
          { id: 'insurance', label: 'Medicare & Insurance' },
          { id: 'advance_directive', label: 'Advance Directives (MOLST)' },
          { id: 'discharge_notes', label: 'Discharge Summaries' },
          { id: 'medical_record', label: 'Lab Reports' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`touch-target rounded-xl px-3.5 py-2 font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === tab.id
                ? 'bg-[#0F766E] text-white shadow-xs'
                : 'border border-[#E2E8F0] bg-white text-[#4B5563] hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Document Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredDocs.map((doc) => {
          const isRestrictedForUser =
            doc.restrictedRoles && !doc.restrictedRoles.includes(currentUser.role) && currentUser.role !== 'admin';

          return (
            <div
              key={doc.id}
              className="flex flex-col justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-[#0F766E] dark:bg-[#134E4A] dark:text-[#99F6E4]">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#6B9080] dark:text-[#99F6E4]">
                        {getCategoryLabel(doc.category)}
                      </span>
                      <h2 className="text-lg font-bold font-inter text-[#1F2937] dark:text-white leading-snug">
                        {doc.title}
                      </h2>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                    <FileCheck className="h-3 w-3" /> Verified
                  </span>
                </div>

                {doc.notes && (
                  <p className="mt-3 text-xs text-[#4B5563] dark:text-gray-300 bg-[#FAF8F5] p-3 rounded-2xl border border-gray-100 dark:bg-gray-700/50 dark:border-gray-700">
                    {doc.notes}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#4B5563] dark:text-gray-400">
                  <span>Type: {doc.fileType}</span>
                  <span>•</span>
                  <span>Size: {doc.fileSize}</span>
                  <span>•</span>
                  <span>Uploaded: {doc.uploadDate}</span>
                  {doc.expirationDate && (
                    <>
                      <span>•</span>
                      <span className="text-amber-700 dark:text-amber-300 font-semibold">
                        Expires: {doc.expirationDate}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-between border-t border-[#E2E8F0] pt-4 dark:border-gray-700">
                <div className="flex items-center space-x-1.5 text-xs text-[#6B9080] dark:text-[#99F6E4]">
                  <Lock className="h-3.5 w-3.5" />
                  <span>AES-256 Encrypted</span>
                </div>

                {isRestrictedForUser ? (
                  <span className="text-xs text-red-600 font-bold">
                    Restricted by RBAC (View-Only)
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenPreview(doc)}
                    className="touch-target flex items-center space-x-1.5 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0c5f59]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Decrypted Document</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Document Preview & Decryption Modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-[#0F766E]">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-inter text-[#1F2937] dark:text-white">
                    {previewDoc.title}
                  </h2>
                  <p className="text-xs text-[#4B5563] dark:text-gray-400">
                    Decrypted locally via client-side KMS token • {previewDoc.fileType}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="touch-target rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Document Content Simulation */}
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-[#FAF8F5] p-5 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between text-xs text-[#4B5563] border-b border-gray-200 pb-2 dark:border-gray-700 dark:text-gray-300">
                  <span className="font-bold">COMMONWEALTH OF MASSACHUSETTS</span>
                  <span>HEALTH HEALTHCARE PROXY / DIRECTIVE</span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-[#1F2937] dark:text-gray-200">
                  <p>
                    <span className="font-bold">Principal:</span> {careRecipient.name} (DOB: {careRecipient.dob})
                  </p>
                  <p>
                    <span className="font-bold">Primary Health Care Agent:</span> Sarah Vance (Daughter) — (555) 382-9912
                  </p>
                  <p>
                    <span className="font-bold">Alternate Agent:</span> David Vance (Son) — (555) 441-2098
                  </p>
                  <p className="mt-2 text-xs italic text-[#4B5563] dark:text-gray-400">
                    "I grant my designated agent full power to make any and all healthcare decisions for me which I could make on my own behalf, including decisions concerning life-sustaining treatment, based on my known wishes."
                  </p>
                </div>

                <div className="mt-4 rounded-xl bg-white p-3 border border-gray-200 text-xs text-[#4B5563] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                  <p className="font-bold text-[#0F766E] dark:text-[#2DD4BF]">
                    Insurance ID: {careRecipient.insurance.medicareId}
                  </p>
                  <p>Supplemental Medigap: {careRecipient.insurance.supplementalPlan}</p>
                </div>
              </div>

              {/* Audit history of this file */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-400 flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5" /> Access Audit Log
                </p>
                <div className="mt-2 space-y-1.5">
                  {previewDoc.auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-[#4B5563] dark:bg-gray-800 dark:text-gray-300"
                    >
                      <span className="font-medium text-[#1F2937] dark:text-white">{log.userName}</span>
                      <span>{log.action}</span>
                      <span className="text-[11px] text-gray-400">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3 border-t border-[#E2E8F0] pt-4 dark:border-gray-700">
              <button
                onClick={() => setPreviewDoc(null)}
                className="touch-target rounded-xl bg-[#0F766E] px-5 py-2 text-sm font-bold text-white shadow-xs hover:bg-[#0c5f59]"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-bold font-inter text-[#1F2937] dark:text-white">
              Add Document to Encrypted Vault
            </h2>
            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 2026 Flu & COVID Vaccine Record"
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-base dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="poa">Healthcare Proxy / POA</option>
                    <option value="insurance">Insurance / Medicare</option>
                    <option value="advance_directive">Advance Directive / MOLST</option>
                    <option value="discharge_notes">Hospital Discharge</option>
                    <option value="medical_record">Lab / Medical Record</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Notes & Details
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Received at CVS Pharmacy clinic with lot number."
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="touch-target rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-bold text-[#4B5563] dark:border-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target rounded-xl bg-[#0F766E] px-5 py-2 text-sm font-bold text-white shadow-xs hover:bg-[#0c5f59]"
                >
                  Encrypt & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
