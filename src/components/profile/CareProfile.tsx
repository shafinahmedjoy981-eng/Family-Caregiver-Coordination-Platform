import React, { useState } from 'react';
import { useCaregiver } from '../../context/CaregiverContext';
import {
  Heart,
  AlertTriangle,
  Stethoscope,
  Shield,
  Phone,
  MapPin,
  Building,
  User,
  Plus,
  Edit2,
  FileCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { HealthcareProvider, EmergencyContact } from '../../types';

export const CareProfile: React.FC = () => {
  const { careRecipient, updateCareRecipient, currentUser, canEdit } = useCaregiver();

  const [activeTab, setActiveTab] = useState<'clinical' | 'providers' | 'insurance' | 'contacts'>('clinical');
  const [isEditingBasic, setIsEditingBasic] = useState(false);

  // Edit fields
  const [prefName, setPrefName] = useState(careRecipient.preferredName);
  const [bloodType, setBloodType] = useState(careRecipient.bloodType || 'O+');
  const [dietary, setDietary] = useState(
    (careRecipient.dietaryRestrictions || careRecipient.dietaryNotes || []).join(', ')
  );
  const [mobility, setMobility] = useState(
    careRecipient.mobilityNotes || 'Independent in home; uses cane for outdoors & stairs'
  );

  const handleSaveBasic = (e: React.FormEvent) => {
    e.preventDefault();
    updateCareRecipient({
      preferredName: prefName,
      bloodType,
      dietaryRestrictions: dietary.split(',').map((s: string) => s.trim()).filter(Boolean),
      dietaryNotes: dietary.split(',').map((s: string) => s.trim()).filter(Boolean),
      mobilityNotes: mobility,
    });
    setIsEditingBasic(false);
  };

  const emergencyContactsList: EmergencyContact[] =
    careRecipient.emergencyContacts && careRecipient.emergencyContacts.length > 0
      ? careRecipient.emergencyContacts
      : [
          {
            id: 'ec1',
            name: careRecipient.emergencyContact.name,
            phone: careRecipient.emergencyContact.phone,
            relationship: careRecipient.emergencyContact.relationship,
            priority: 1,
            isPOA: true,
          },
          {
            id: 'ec2',
            name: 'David Vance',
            phone: '(555) 492-8812',
            relationship: 'Son / Secondary Emergency',
            priority: 2,
            isPOA: false,
          },
          {
            id: 'ec3',
            name: 'Oakridge Senior Neighbors (Mrs. Gable)',
            phone: '(555) 231-9014',
            relationship: 'Immediate Neighbor with House Key',
            priority: 3,
            isPOA: false,
          },
        ];

  return (
    <div id="care-profile-view" className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <img
            src={
              careRecipient.photoUrl ||
              'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
            }
            alt={careRecipient.name}
            className="h-16 w-16 rounded-full object-cover ring-4 ring-[#CCFBF1] dark:ring-[#134E4A]"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold font-inter text-[#1F2937] dark:text-white">
                {careRecipient.name}
              </h1>
              <span className="rounded-full bg-[#CCFBF1] px-2.5 py-0.5 text-xs font-bold text-[#0F766E] dark:bg-[#134E4A] dark:text-[#99F6E4]">
                Prefers "{careRecipient.preferredName}"
              </span>
            </div>
            <p className="mt-0.5 text-sm text-[#4B5563] dark:text-gray-300">
              DOB: {careRecipient.dob} ({careRecipient.age || 76} years old) • Blood Type: {careRecipient.bloodType || 'O+'}
            </p>
          </div>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsEditingBasic(!isEditingBasic)}
            className="touch-target flex items-center space-x-1.5 rounded-2xl border border-[#E2E8F0] bg-[#FAF8F5] px-4 py-2.5 text-sm font-semibold text-[#1F2937] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
          >
            <Edit2 className="h-4 w-4" />
            <span>{isEditingBasic ? 'Cancel Edit' : 'Edit Summary'}</span>
          </button>
        )}
      </div>

      {/* Edit Form */}
      {isEditingBasic && (
        <form onSubmit={handleSaveBasic} className="rounded-3xl border border-[#0F766E]/40 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800 space-y-4">
          <h2 className="text-lg font-bold font-inter text-[#1F2937] dark:text-white">
            Update Core Vitals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                Preferred Name
              </label>
              <input
                type="text"
                value={prefName}
                onChange={(e) => setPrefName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                Blood Type
              </label>
              <input
                type="text"
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                Dietary Preferences / Restrictions
              </label>
              <input
                type="text"
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                Mobility & Fall Risk Notes
              </label>
              <input
                type="text"
                value={mobility}
                onChange={(e) => setMobility(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingBasic(false)}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold dark:border-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#0F766E] px-5 py-2 text-xs font-bold text-white shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2 text-sm font-semibold dark:border-gray-700">
        {[
          { id: 'clinical', label: 'Clinical Snapshot & Allergies' },
          { id: 'providers', label: 'Care Providers' },
          { id: 'insurance', label: 'Insurance & Pharmacy' },
          { id: 'contacts', label: 'Emergency Contacts' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`touch-target rounded-xl px-4 py-2 transition-colors ${
              activeTab === t.id
                ? 'bg-[#0F766E] text-white shadow-xs'
                : 'text-[#4B5563] hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Clinical Snapshot */}
      {activeTab === 'clinical' && (
        <div className="space-y-6">
          {/* Allergies - Critical Safety Banner */}
          <div className="rounded-3xl border-2 border-red-300 bg-red-50/70 p-6 dark:border-red-900/60 dark:bg-red-950/20">
            <div className="flex items-center space-x-2 text-red-900 dark:text-red-200">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <h2 className="text-base font-bold font-inter">
                Known Drug & Food Allergies
              </h2>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {careRecipient.allergies.map((allergy) => (
                <div
                  key={allergy.id}
                  className="rounded-2xl border border-red-200 bg-white p-4 shadow-xs dark:border-red-900/40 dark:bg-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-base font-bold text-red-950 dark:text-red-200">
                      {allergy.allergen}
                    </p>
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-800 dark:bg-red-900/80 dark:text-red-200">
                      {allergy.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#4B5563] dark:text-gray-300">
                    Reaction: {allergy.reaction}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Chronic Conditions */}
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-base font-bold font-inter text-[#1F2937] dark:text-white">
              Diagnosed Medical Conditions
            </h2>
            <div className="mt-4 space-y-3">
              {careRecipient.conditions.map((cond) => (
                <div
                  key={cond.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-[#E2E8F0] bg-[#FAF8F5] p-4 dark:border-gray-700 dark:bg-gray-700/50"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-base font-bold text-[#1F2937] dark:text-white">
                        {cond.name}
                      </p>
                      <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-semibold text-[#0F766E] border border-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:text-[#2DD4BF]">
                        Diagnosed: {cond.diagnosedYear || cond.diagnosedDate || 'Recorded'}
                      </span>
                    </div>
                    {cond.notes && (
                      <p className="mt-1 text-xs text-[#4B5563] dark:text-gray-300">
                        {cond.notes}
                      </p>
                    )}
                  </div>
                  <span className="mt-2 sm:mt-0 text-xs font-semibold text-[#16A34A] flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Actively Managed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Healthcare Providers Directory */}
      {activeTab === 'providers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {careRecipient.providers.map((prov) => (
            <div
              key={prov.id}
              className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6B9080] dark:text-[#99F6E4]">
                      {prov.specialty}
                    </span>
                    <h2 className="text-lg font-bold font-inter text-[#1F2937] dark:text-white mt-0.5">
                      {prov.name}
                    </h2>
                  </div>
                  <span className="rounded-full bg-teal-50 p-2 text-[#0F766E] dark:bg-[#134E4A] dark:text-[#99F6E4]">
                    <Stethoscope className="h-4 w-4" />
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs text-[#4B5563] dark:text-gray-300">
                  <p className="flex items-center space-x-1.5">
                    <Building className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span>{prov.clinic || prov.clinicName}</span>
                  </p>
                  <p className="flex items-center space-x-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span>{prov.address}</span>
                  </p>
                  {prov.notes && (
                    <p className="italic bg-[#FAF8F5] p-2 rounded-xl border border-gray-100 dark:bg-gray-700/50 dark:border-gray-700">
                      "{prov.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E2E8F0] dark:border-gray-700">
                <a
                  href={`tel:${prov.phone.replace(/[^0-9]/g, '')}`}
                  className="touch-target flex w-full items-center justify-center space-x-2 rounded-xl bg-[#0F766E] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0c5f59]"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call Provider: {prov.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Insurance & Pharmacy */}
      {activeTab === 'insurance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Insurance Card Simulation */}
          <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm dark:border-blue-900 dark:from-blue-950/40 dark:to-indigo-950/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                {careRecipient.insurance.primaryProvider || careRecipient.insurance.provider}
              </span>
              <Shield className="h-5 w-5 text-blue-700 dark:text-blue-400" />
            </div>

            <div className="mt-6 space-y-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-blue-800/70 dark:text-blue-300/70">
                  Medicare ID / Beneficiary ID
                </p>
                <p className="text-xl font-mono font-bold text-blue-950 dark:text-white tracking-wider">
                  {careRecipient.insurance.medicareId}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-blue-200/70 dark:border-blue-800/60">
                <div>
                  <p className="text-[10px] text-blue-800/70 dark:text-blue-300/70">Policy / ID</p>
                  <p className="font-semibold text-blue-950 dark:text-white">
                    {careRecipient.insurance.policyNumber}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-blue-800/70 dark:text-blue-300/70">Rx BIN / Group</p>
                  <p className="font-semibold text-blue-950 dark:text-white">
                    {careRecipient.insurance.rxBin} / {careRecipient.insurance.rxGroup}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pharmacy Info */}
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
                  Primary Pharmacy
                </span>
                <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-[#0F766E] dark:bg-[#134E4A] dark:text-[#99F6E4]">
                  Automated Refills Active
                </span>
              </div>

              <h2 className="mt-2 text-lg font-bold font-inter text-[#1F2937] dark:text-white">
                {careRecipient.pharmacy.name}
              </h2>

              <div className="mt-3 space-y-1.5 text-xs text-[#4B5563] dark:text-gray-300">
                <p className="flex items-center space-x-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  <span>{careRecipient.pharmacy.address}</span>
                </p>
                <p>Hours: {careRecipient.pharmacy.hours}</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E2E8F0] dark:border-gray-700">
              <a
                href={`tel:${careRecipient.pharmacy.phone.replace(/[^0-9]/g, '')}`}
                className="touch-target flex w-full items-center justify-center space-x-2 rounded-xl bg-[#0F766E] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0c5f59]"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call Pharmacy: {careRecipient.pharmacy.phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Emergency Contacts with One-Tap Dial */}
      {activeTab === 'contacts' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {emergencyContactsList.map((contact) => (
            <div
              key={contact.id || contact.name}
              className={`rounded-3xl border p-6 shadow-xs flex flex-col justify-between ${
                contact.priority === 1
                  ? 'border-red-200 bg-red-50/40 dark:border-red-900/60 dark:bg-red-950/20'
                  : 'border-[#E2E8F0] bg-white dark:border-gray-700 dark:bg-gray-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      contact.priority === 1
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200'
                        : 'bg-gray-100 text-[#4B5563] dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Priority #{contact.priority || 1}
                  </span>
                  {contact.isPOA && (
                    <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-[#0F766E] dark:bg-[#134E4A] dark:text-[#99F6E4]">
                      Legal POA
                    </span>
                  )}
                </div>

                <h2 className="mt-3 text-lg font-bold font-inter text-[#1F2937] dark:text-white">
                  {contact.name}
                </h2>
                <p className="text-xs text-[#4B5563] dark:text-gray-300">
                  {contact.relationship}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E2E8F0] dark:border-gray-700">
                <a
                  href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                  className="touch-target flex w-full items-center justify-center space-x-2 rounded-xl bg-[#0F766E] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0c5f59]"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call {contact.name.split(' ')[0]}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
