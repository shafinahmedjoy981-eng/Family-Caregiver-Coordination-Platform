import React, { useState } from 'react';
import { useCaregiver } from '../../context/CaregiverContext';
import {
  Pill,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  ShieldCheck,
  Calendar,
  Volume2,
  Info,
  Check,
  HelpCircle,
} from 'lucide-react';
import { Medication, TimeSlot } from '../../types';

export const MedicationTracker: React.FC = () => {
  const {
    medications,
    logMedicationDose,
    recordRefill,
    addMedication,
    currentUser,
    careRecipient,
    speakText,
  } = useCaregiver();

  const [activeWindow, setActiveWindow] = useState<TimeSlot | 'all'>('all');
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [refillModalMed, setRefillModalMed] = useState<Medication | null>(null);
  const [refillCount, setRefillCount] = useState<number>(90);

  // Form for new med
  const [newMedName, setNewMedName] = useState('');
  const [newGenericName, setNewGenericName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newInstructions, setNewInstructions] = useState('');
  const [newFrequency, setNewFrequency] = useState('Once daily (Morning)');
  const [newSlots, setNewSlots] = useState<TimeSlot[]>(['morning']);
  const [newColor, setNewColor] = useState('#FBBF24');
  const [newShape, setNewShape] = useState<'round' | 'oval' | 'capsule'>('round');
  const [newRemaining, setNewRemaining] = useState(30);
  const [newTotal, setNewTotal] = useState(30);
  const [newThreshold, setNewThreshold] = useState(7);
  const [newPrescriber, setNewPrescriber] = useState('Dr. Margaret Chen, MD');
  const [newRx, setNewRx] = useState('RX-102938');
  const [newPurpose, setNewPurpose] = useState('');

  const todayStr = '2026-09-22';

  const timeSlotWindows: { id: TimeSlot; label: string; time: string }[] = [
    { id: 'morning', label: 'Morning', time: '8:00 AM' },
    { id: 'afternoon', label: 'Afternoon', time: '1:00 PM' },
    { id: 'evening', label: 'Evening', time: '6:30 PM' },
    { id: 'bedtime', label: 'Bedtime', time: '9:30 PM' },
  ];

  const handleTakeDose = (med: Medication, slot: TimeSlot) => {
    logMedicationDose(med.id, slot, 'taken', 'Taken by Eleanor with water');
  };

  const handleRecordRefillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refillModalMed) return;
    recordRefill(refillModalMed.id, refillCount);
    setRefillModalMed(null);
  };

  const handleCreateMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;

    addMedication({
      name: newMedName.trim(),
      genericName: newGenericName.trim() || undefined,
      dosage: newDosage.trim(),
      instructions: newInstructions.trim(),
      frequency: newFrequency,
      timeSlots: newSlots,
      pillColor: newColor,
      pillShape: newShape,
      remainingDoses: Number(newRemaining),
      totalDoses: Number(newTotal),
      refillDueThreshold: Number(newThreshold),
      prescriber: newPrescriber,
      rxNumber: newRx,
      purpose: newPurpose.trim(),
    });

    setIsAddMedOpen(false);
    setNewMedName('');
    setNewDosage('');
    setNewInstructions('');
    setNewPurpose('');
  };

  return (
    <div id="medication-tracker-view" className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800">
        <div>
          <div className="flex items-center space-x-2">
            <Pill className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
              Medication Adherence & Safety
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold font-inter text-[#1F2937] dark:text-white">
            Mom’s Medication Schedule
          </h1>
          <p className="mt-1 text-sm text-[#4B5563] dark:text-gray-300">
            Dignified tracking with visual pill guides, refill thresholds, and gentle nudges.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() =>
              speakText(
                `Eleanor’s medications: Morning dose of Lisinopril 20mg and Calcium Citrate was logged as taken. Lisinopril 90-day refill is ready for pickup at Walgreens.`
              )
            }
            className="touch-target flex items-center space-x-1.5 rounded-2xl border border-[#E2E8F0] bg-[#FAF8F5] px-4 py-2.5 text-sm font-semibold text-[#1F2937] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
          >
            <Volume2 className="h-4 w-4 text-[#0F766E] dark:text-[#2DD4BF]" />
            <span>Audio Readout</span>
          </button>

          <button
            onClick={() => setIsAddMedOpen(true)}
            className="touch-target flex items-center space-x-2 rounded-2xl bg-[#0F766E] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#0c5f59]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Medication</span>
          </button>
        </div>
      </div>

      {/* Time Window Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1" role="tablist">
        <button
          onClick={() => setActiveWindow('all')}
          className={`touch-target rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeWindow === 'all'
              ? 'bg-[#0F766E] text-white shadow-xs'
              : 'border border-[#E2E8F0] bg-white text-[#4B5563] hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
          role="tab"
          aria-selected={activeWindow === 'all'}
        >
          All Daily Windows
        </button>

        {timeSlotWindows.map((slot) => (
          <button
            key={slot.id}
            onClick={() => setActiveWindow(slot.id)}
            className={`touch-target rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeWindow === slot.id
                ? 'bg-[#0F766E] text-white shadow-xs'
                : 'border border-[#E2E8F0] bg-white text-[#4B5563] hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
            role="tab"
            aria-selected={activeWindow === slot.id}
          >
            {slot.label} ({slot.time})
          </button>
        ))}
      </div>

      {/* Medication Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {medications
          .filter((m) => activeWindow === 'all' || m.timeSlots.includes(activeWindow))
          .map((med) => {
            const isRefillAlert = med.remainingDoses <= med.refillDueThreshold;
            const todayLog = med.adherenceLogs.find((l) => l.date === todayStr && l.status === 'taken');

            return (
              <div
                key={med.id}
                className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                {/* Top header with Visual Pill Simulation */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3.5">
                    {/* Visual Pill Icon with Color & Shape */}
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 shadow-inner shrink-0 dark:border-gray-600"
                      style={{ backgroundColor: med.pillColor }}
                      title={`Visual Pill: ${med.pillShape} shape, ${med.pillColor}`}
                    >
                      <div
                        className={`border-2 border-white/60 bg-black/10 shadow-xs ${
                          med.pillShape === 'round'
                            ? 'h-7 w-7 rounded-full'
                            : med.pillShape === 'capsule'
                            ? 'h-8 w-4 rounded-full'
                            : 'h-6 w-8 rounded-xl'
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-xl font-bold font-inter text-[#1F2937] dark:text-white">
                          {med.name}
                        </h2>
                        <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-xs font-bold text-[#4B5563] dark:bg-gray-700 dark:text-gray-300">
                          {med.dosage}
                        </span>
                      </div>
                      {med.genericName && (
                        <p className="text-xs text-[#6B9080] dark:text-[#99F6E4] mt-0.5">
                          Generic: {med.genericName}
                        </p>
                      )}
                      <p className="text-xs text-[#4B5563] dark:text-gray-300 mt-1">
                        Purpose: <span className="font-semibold">{med.purpose}</span>
                      </p>
                    </div>
                  </div>

                  {/* Refill status badge */}
                  {isRefillAlert ? (
                    <span className="flex items-center space-x-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-[#F59E0B] border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Refill Soon</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-[#0F766E] border border-teal-200 dark:bg-teal-950/40 dark:text-[#2DD4BF] dark:border-teal-800">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Supply Good</span>
                    </span>
                  )}
                </div>

                {/* Instructions Box */}
                <div className="mt-4 rounded-2xl bg-[#FAF8F5] p-3.5 border border-[#E2E8F0] dark:bg-gray-700/50 dark:border-gray-700">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-400">
                    Administration Instructions
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#1F2937] dark:text-gray-200 leading-relaxed">
                    {med.instructions}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-[#4B5563] dark:text-gray-300 pt-2 border-t border-gray-200/60 dark:border-gray-600">
                    <span>Frequency: {med.frequency}</span>
                    <span>Prescribed by: {med.prescriber}</span>
                  </div>
                </div>

                {/* Refill Countdown Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1F2937] dark:text-gray-300">
                      Remaining Supply: {med.remainingDoses} doses left
                    </span>
                    <button
                      onClick={() => setRefillModalMed(med)}
                      className="text-xs font-bold text-[#0F766E] hover:underline dark:text-[#2DD4BF]"
                    >
                      + Record Refill
                    </button>
                  </div>
                  <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isRefillAlert ? 'bg-[#F59E0B]' : 'bg-[#0F766E]'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.max(5, (med.remainingDoses / med.totalDoses) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Action / Adherence confirmation */}
                <div className="mt-5 flex items-center justify-between border-t border-[#E2E8F0] pt-4 dark:border-gray-700">
                  {todayLog ? (
                    <div className="flex items-center space-x-2 text-xs font-bold text-[#16A34A]">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Taken Today ({todayLog.loggedAt} by {todayLog.loggedByName})</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-xs text-[#4B5563] dark:text-gray-400">
                      <Clock className="h-4 w-4 text-[#F59E0B]" />
                      <span>Scheduled for {med.timeSlots.join(', ')}</span>
                    </div>
                  )}

                  {!todayLog && (
                    <button
                      onClick={() => handleTakeDose(med, med.timeSlots[0] || 'morning')}
                      className="touch-target rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0c5f59]"
                    >
                      Log Taken ✓
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Record Refill Modal */}
      {refillModalMed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-bold font-inter text-[#1F2937] dark:text-white">
              Record Prescription Refill
            </h2>
            <p className="text-xs text-[#4B5563] mt-1 dark:text-gray-400">
              Refilling <span className="font-bold text-[#0F766E]">{refillModalMed.name}</span> ({refillModalMed.dosage})
            </p>

            <form onSubmit={handleRecordRefillSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  How many doses picked up?
                </label>
                <div className="mt-2 flex gap-2">
                  {[30, 60, 90].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setRefillCount(qty)}
                      className={`flex-1 rounded-xl py-2.5 text-sm font-bold ${
                        refillCount === qty
                          ? 'bg-[#0F766E] text-white'
                          : 'border border-[#E2E8F0] bg-gray-50 text-[#1F2937] dark:border-gray-700 dark:bg-gray-800 dark:text-white'
                      }`}
                    >
                      +{qty} Doses
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-[#FAF8F5] p-3 border border-[#E2E8F0] text-xs text-[#4B5563] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                Pharmacy: {careRecipient.pharmacy.name} ({careRecipient.pharmacy.phone})
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setRefillModalMed(null)}
                  className="touch-target rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-bold text-[#4B5563] dark:border-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target rounded-xl bg-[#0F766E] px-5 py-2 text-sm font-bold text-white shadow-xs hover:bg-[#0c5f59]"
                >
                  Save Refill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Medication Modal */}
      {isAddMedOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold font-inter text-[#1F2937] dark:text-white">
              Add New Medication
            </h2>
            <form onSubmit={handleCreateMed} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                    Medication Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    placeholder="e.g. Metoprolol Tartrate"
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                    Strength / Dosage *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDosage}
                    onChange={(e) => setNewDosage(e.target.value)}
                    placeholder="e.g. 25 mg"
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Instructions
                </label>
                <input
                  type="text"
                  required
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  placeholder="e.g. Take 1 tablet twice daily with meals"
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Clinical Purpose
                </label>
                <input
                  type="text"
                  required
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  placeholder="e.g. Blood Pressure & Heart Rate"
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                    Pill Shape
                  </label>
                  <select
                    value={newShape}
                    onChange={(e) => setNewShape(e.target.value as any)}
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="round">Round Tablet</option>
                    <option value="oval">Oval Caplet</option>
                    <option value="capsule">Capsule</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                    Initial Supply (Doses)
                  </label>
                  <input
                    type="number"
                    value={newRemaining}
                    onChange={(e) => {
                      setNewRemaining(Number(e.target.value));
                      setNewTotal(Number(e.target.value));
                    }}
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddMedOpen(false)}
                  className="touch-target rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-bold text-[#4B5563] dark:border-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target rounded-xl bg-[#0F766E] px-5 py-2 text-sm font-bold text-white shadow-xs hover:bg-[#0c5f59]"
                >
                  Add to Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
