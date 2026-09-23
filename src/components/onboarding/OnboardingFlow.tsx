import React, { useState } from 'react';
import { useCaregiver } from '../../context/CaregiverContext';
import {
  Heart,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Users,
  Shield,
  Calendar,
  Pill,
  UserCheck,
  Stethoscope,
} from 'lucide-react';
import { CaregiverSituation } from '../../types';

export const OnboardingFlow: React.FC = () => {
  const { onboarding, updateOnboarding, completeOnboarding, updateCareRecipient } = useCaregiver();

  // Local form inputs
  const [recipientName, setRecipientName] = useState('Eleanor Vance');
  const [preferredName, setPreferredName] = useState('Mom');
  const [relationship, setRelationship] = useState('Parent');
  const [situation, setSituation] = useState<CaregiverSituation>('post_hospital');
  const [primaryCondition, setPrimaryCondition] = useState('Post-Op Hip Replacement & Hypertension');
  const [siblingName, setSiblingName] = useState('David Vance');
  const [siblingEmail, setSiblingEmail] = useState('david.vance@example.com');

  const step = onboarding.currentStep ?? 1;

  const handleNext = () => {
    if (step === 1) {
      updateOnboarding({ recipientName, relationship, currentStep: 2 });
    } else if (step === 2) {
      updateOnboarding({ situation, currentStep: 3 });
    } else if (step === 3) {
      updateCareRecipient({
        name: recipientName,
        preferredName: preferredName || recipientName,
      });
      updateOnboarding({ primaryCondition, currentStep: 4 });
    } else if (step === 4) {
      updateOnboarding({ firstInviteEmail: siblingEmail, currentStep: 5 });
    } else if (step === 5) {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      updateOnboarding({ currentStep: step - 1 });
    }
  };

  return (
    <div id="onboarding-flow-container" className="mx-auto max-w-2xl py-8 px-4">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
          <span>Step {step} of 5</span>
          <span>
            {step === 1 && 'Who you care for'}
            {step === 2 && 'Care situation'}
            {step === 3 && 'Core essentials'}
            {step === 4 && 'Circle invitations'}
            {step === 5 && 'Ready'}
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-[#0F766E] transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {/* Step 1: Who are you caring for? */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
                Welcome to Threadwell
              </span>
              <h1 className="mt-1 text-2xl font-bold font-inter text-[#1F2937] dark:text-white">
                Who are you caring for?
              </h1>
              <p className="mt-2 text-sm text-[#4B5563] dark:text-gray-300">
                Caregiving is an act of deep love. We are here to bring calm and structure to your family.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Their Full Legal Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-base text-[#1F2937] dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  What do you call them? (Preferred Name)
                </label>
                <input
                  type="text"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  placeholder="e.g. Mom"
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-base text-[#1F2937] dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Relationship
                </label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Parent', 'Spouse', 'Relative', 'Client / Other'].map((rel) => (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => setRelationship(rel)}
                      className={`touch-target rounded-xl py-2.5 text-xs font-bold transition-all ${
                        relationship === rel
                          ? 'bg-[#0F766E] text-white shadow-xs'
                          : 'border border-[#E2E8F0] bg-gray-50 text-[#1F2937] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {rel}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Caregiver Situation (Emotional Branching) */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
                Situation Routing
              </span>
              <h1 className="mt-1 text-2xl font-bold font-inter text-[#1F2937] dark:text-white">
                What best describes your current moment?
              </h1>
              <p className="mt-2 text-sm text-[#4B5563] dark:text-gray-300">
                This configures your primary dashboard to prioritize what matters right now without overwhelm.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'post_hospital',
                  title: 'Post-Hospital / Rehab Discharge',
                  desc: 'Just returned home. Need strict medication routines, physical therapy rides, and wound care check-ins.',
                  highlight: 'Prioritizes Medications & Rides',
                },
                {
                  id: 'sudden_diagnosis',
                  title: 'Sudden Medical Diagnosis or Fall',
                  desc: 'Navigating tests, appointments, doctor followups, and sharing urgent status with family.',
                  highlight: 'Prioritizes Shared Calendar & Timeline',
                },
                {
                  id: 'long_term',
                  title: 'Long-Term Age-Related Decline',
                  desc: 'Managing ongoing chronic care, meal coordination, visiting aides, and mobility needs.',
                  highlight: 'Prioritizes Task Delegation & Aide Shifts',
                },
                {
                  id: 'preventive',
                  title: 'Preventive & Proactive Planning',
                  desc: 'Healthy today, but assembling Healthcare Proxy, Medicare info, and emergency numbers early.',
                  highlight: 'Prioritizes Encrypted Vault & Contacts',
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSituation(opt.id as CaregiverSituation)}
                  className={`cursor-pointer rounded-2xl border p-4.5 transition-all ${
                    situation === opt.id
                      ? 'border-[#0F766E] bg-teal-50/50 ring-2 ring-[#0F766E]/20 dark:bg-[#134E4A]/30 dark:border-[#2DD4BF]'
                      : 'border-[#E2E8F0] hover:border-gray-300 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-base font-bold font-inter text-[#1F2937] dark:text-white">
                        {opt.title}
                      </h2>
                      <p className="mt-1 text-xs text-[#4B5563] dark:text-gray-300">
                        {opt.desc}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#CCFBF1] px-2 py-0.5 text-[10px] font-bold text-[#0F766E] dark:bg-[#134E4A] dark:text-[#99F6E4]">
                      {opt.highlight}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Immediate Essentials */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
                Critical Vitals
              </span>
              <h1 className="mt-1 text-2xl font-bold font-inter text-[#1F2937] dark:text-white">
                Key conditions and support
              </h1>
              <p className="mt-2 text-sm text-[#4B5563] dark:text-gray-300">
                You can add full medication and insurance details at any time in the Care Profile.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Primary Condition or Recent Event
                </label>
                <input
                  type="text"
                  value={primaryCondition}
                  onChange={(e) => setPrimaryCondition(e.target.value)}
                  placeholder="e.g. Post-Op Hip Surgery, Mild Cognitive Impairment, Hypertension"
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm text-[#1F2937] dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="rounded-2xl border border-teal-200 bg-[#CCFBF1]/20 p-4 text-xs text-[#0F766E] dark:text-[#99F6E4]">
                <p className="font-bold">Pre-loaded Recommended Baseline:</p>
                <p className="mt-1 text-[#4B5563] dark:text-gray-300">
                  We have prepared default schedules for daily medication windows, primary provider directory, and emergency contacts based on clinical standards.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Sibling / Circle Invitations */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
                Care Circle
              </span>
              <h1 className="mt-1 text-2xl font-bold font-inter text-[#1F2937] dark:text-white">
                Invite your first co-caregiver
              </h1>
              <p className="mt-2 text-sm text-[#4B5563] dark:text-gray-300">
                Caregiving shouldn't rest entirely on one pair of shoulders. Invite a sibling, partner, or visiting aide.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Co-Caregiver Name
                </label>
                <input
                  type="text"
                  value={siblingName}
                  onChange={(e) => setSiblingName(e.target.value)}
                  placeholder="e.g. David Vance"
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm text-[#1F2937] dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={siblingEmail}
                  onChange={(e) => setSiblingEmail(e.target.value)}
                  placeholder="david@example.com"
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm text-[#1F2937] dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <p className="text-xs text-[#4B5563] dark:text-gray-400">
                They will receive an invitation link with Contributor access to claim tasks and view the shared care calendar.
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Ready to Begin */}
        {step === 5 && (
          <div className="space-y-6 text-center py-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#CCFBF1] text-[#0F766E] dark:bg-[#134E4A] dark:text-[#99F6E4]">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <h1 className="text-2xl font-bold font-inter text-[#1F2937] dark:text-white">
                Everything is ready for {preferredName || recipientName}
              </h1>
              <p className="mt-2 text-sm text-[#4B5563] dark:text-gray-300 max-w-md mx-auto">
                Your family care circle is active, the shared calendar is initialized, and medication tracking is ready.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-[#FAF8F5] p-4 text-xs text-left space-y-1.5 dark:bg-gray-700/50 dark:border-gray-700">
              <p className="font-bold text-[#1F2937] dark:text-white">Active Safeguards:</p>
              <p className="text-[#4B5563] dark:text-gray-300">✓ HIPAA-aligned audit trail enabled</p>
              <p className="text-[#4B5563] dark:text-gray-300">✓ Zero-shame adherence notifications active</p>
              <p className="text-[#4B5563] dark:text-gray-300">✓ One-tap task claiming for {siblingName}</p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="mt-8 flex items-center justify-between border-t border-[#E2E8F0] pt-6 dark:border-gray-700">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="touch-target flex items-center space-x-1.5 rounded-xl border border-[#E2E8F0] px-4 py-2.5 text-xs font-bold text-[#4B5563] hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          ) : (
            <span />
          )}

          <button
            onClick={handleNext}
            className="touch-target flex items-center space-x-2 rounded-xl bg-[#0F766E] px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-[#0c5f59]"
          >
            <span>{step === 5 ? 'Open Family Living Room' : 'Continue'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
