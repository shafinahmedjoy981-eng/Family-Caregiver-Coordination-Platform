import React, { useState } from 'react';
import { useCaregiver } from '../../context/CaregiverContext';
import {
  Heart,
  Volume2,
  CheckCircle2,
  Calendar,
  Pill,
  Phone,
  Sun,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';

export const SeniorFacingView: React.FC = () => {
  const {
    careRecipient,
    medications,
    calendarEvents,
    logMedicationDose,
    setIsSeniorMode,
    speakText,
  } = useCaregiver();

  const [pillsLogged, setPillsLogged] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const morningMed = medications[0];
  const nextEvent = calendarEvents[0];

  const handleLogPills = () => {
    if (morningMed) {
      logMedicationDose(morningMed.id, 'morning', 'taken', 'Confirmed via Senior Mode by Eleanor');
    }
    setPillsLogged(true);
    speakText("Thank you, Eleanor. We've recorded that you took your morning pills!");
    setToastMessage("Wonderful! Your pills have been logged.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleReadSchedule = () => {
    speakText(
      `Good morning ${careRecipient.preferredName}! Today is Tuesday. You have physical therapy at 10:30 AM with Elena, and Sarah is stopping by this afternoon. You're doing great!`
    );
  };

  return (
    <div
      id="senior-facing-mode-container"
      className="mx-auto max-w-4xl space-y-8 p-4 sm:p-6 pb-24"
    >
      {/* Return to standard view button */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsSeniorMode(false)}
          className="touch-target flex items-center space-x-2 rounded-2xl bg-white border-2 border-gray-300 px-5 py-3 text-base font-bold text-[#1F2937] shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Exit Senior View</span>
        </button>

        <button
          onClick={handleReadSchedule}
          className="touch-target flex items-center space-x-2 rounded-2xl bg-[#CCFBF1] border-2 border-[#0F766E] px-5 py-3 text-base font-bold text-[#0F766E] dark:bg-[#134E4A] dark:text-[#99F6E4]"
          aria-label="Read today's schedule aloud"
        >
          <Volume2 className="h-6 w-6" />
          <span>Read Aloud</span>
        </button>
      </div>

      {/* Greeting Banner */}
      <div className="rounded-3xl border-3 border-[#0F766E] bg-white p-8 shadow-md dark:border-[#2DD4BF] dark:bg-gray-800 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700 mb-3 dark:bg-amber-900/60 dark:text-amber-200">
          <Sun className="h-10 w-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
          Good Morning, {careRecipient.preferredName}!
        </h1>
        <p className="mt-3 text-xl sm:text-2xl text-[#4B5563] dark:text-gray-200 max-w-2xl mx-auto leading-relaxed">
          Your family circle is active today. Everything is calm and taken care of.
        </p>
      </div>

      {toastMessage && (
        <div className="rounded-2xl bg-[#16A34A] p-4 text-center text-xl font-bold text-white shadow-lg">
          {toastMessage}
        </div>
      )}

      {/* Big Card 1: Today's Pill Routine */}
      <div className="rounded-3xl border-3 border-gray-200 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-[#0F766E] dark:bg-teal-900/60 dark:text-[#2DD4BF]">
            <Pill className="h-10 w-10" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-white">
              Morning Pills
            </h2>
            <p className="text-lg sm:text-xl text-[#4B5563] dark:text-gray-300">
              {morningMed?.name} ({morningMed?.dosage}) • Take with full glass of water
            </p>
          </div>
        </div>

        <div className="mt-6">
          {pillsLogged ? (
            <div className="flex items-center justify-center space-x-3 rounded-2xl bg-[#16A34A]/10 border-2 border-[#16A34A] p-6 text-xl sm:text-2xl font-bold text-[#16A34A]">
              <CheckCircle2 className="h-8 w-8" />
              <span>You took your morning pills! Wonderful.</span>
            </div>
          ) : (
            <button
              onClick={handleLogPills}
              className="touch-target w-full rounded-2xl bg-[#0F766E] py-6 px-6 text-xl sm:text-2xl font-bold text-white shadow-lg hover:bg-[#0c5f59] active:scale-98 transition-transform"
            >
              ✓ I Have Taken My Morning Pills
            </button>
          )}
        </div>
      </div>

      {/* Big Card 2: Today's Plan */}
      <div className="rounded-3xl border-3 border-gray-200 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
            <Calendar className="h-10 w-10" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-white">
              Today's Visitor
            </h2>
            <p className="text-lg sm:text-xl text-[#4B5563] dark:text-gray-300">
              Elena Rivera, CNA is with you at home
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-[#FAF8F5] border-2 border-gray-200 p-6 text-lg sm:text-xl text-[#1F2937] dark:bg-gray-700/50 dark:border-gray-600 dark:text-white">
          <p className="font-bold">Next event: Physical Therapy</p>
          <p className="mt-1 text-[#4B5563] dark:text-gray-300">
            Tomorrow at 10:30 AM • Sarah is driving you
          </p>
        </div>
      </div>

      {/* Big Card 3: One-Tap Emergency / Family Call */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <a
          href="tel:5553829912"
          className="touch-target flex items-center justify-center space-x-4 rounded-3xl bg-[#0F766E] p-8 text-white shadow-lg hover:bg-[#0c5f59] active:scale-98 transition-transform"
        >
          <Phone className="h-10 w-10 shrink-0" />
          <div className="text-left">
            <p className="text-sm font-bold uppercase tracking-wider text-teal-200">
              Call Daughter
            </p>
            <p className="text-2xl font-bold">Call Sarah</p>
          </div>
        </a>

        <a
          href="tel:5554412098"
          className="touch-target flex items-center justify-center space-x-4 rounded-3xl bg-blue-700 p-8 text-white shadow-lg hover:bg-blue-800 active:scale-98 transition-transform"
        >
          <Phone className="h-10 w-10 shrink-0" />
          <div className="text-left">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-200">
              Call Son
            </p>
            <p className="text-2xl font-bold">Call David</p>
          </div>
        </a>
      </div>
    </div>
  );
};
