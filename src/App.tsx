/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CaregiverProvider, useCaregiver } from './context/CaregiverContext';
import { AppHeader } from './components/navigation/AppHeader';
import { AppNavigation } from './components/navigation/AppNavigation';
import { AccessibilityToolbar } from './components/navigation/AccessibilityToolbar';
import { QuickCaptureModal } from './components/navigation/QuickCaptureModal';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { BentoDashboard } from './components/dashboard/BentoDashboard';
import { SharedCareCalendar } from './components/calendar/SharedCareCalendar';
import { TaskBoard } from './components/tasks/TaskBoard';
import { MedicationTracker } from './components/medications/MedicationTracker';
import { DocumentVault } from './components/vault/DocumentVault';
import { CareProfile } from './components/profile/CareProfile';
import { CareCircleDirectory } from './components/circle/CareCircleDirectory';
import { CircleRbacManager } from './components/circle/CircleRbacManager';
import { FamilyTimeline } from './components/feed/FamilyTimeline';
import { HipaaAuditPage } from './components/audit/HipaaAuditPage';
import { FamilyPlanPage } from './components/billing/FamilyPlanPage';
import { SeniorFacingView } from './components/senior/SeniorFacingView';

const MainAppContent: React.FC = () => {
  const { onboarding, isSeniorMode, activeTab } = useCaregiver();
  const [isAccessibilityOpen, setIsAccessibilityOpen] = React.useState(false);

  // If onboarding is not completed, show the calm onboarding flow
  if (!onboarding.isCompleted) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#1F2937] dark:bg-gray-900 dark:text-gray-100 flex flex-col justify-center">
        <OnboardingFlow />
        <AccessibilityToolbar
          isOpen={isAccessibilityOpen}
          onClose={() => setIsAccessibilityOpen(false)}
        />
      </div>
    );
  }

  // If senior mode is active, show the voice-first, large-print, ultra-simple interface
  if (isSeniorMode) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#1F2937] dark:bg-gray-900 dark:text-gray-100">
        <SeniorFacingView />
        <AccessibilityToolbar
          isOpen={isAccessibilityOpen}
          onClose={() => setIsAccessibilityOpen(false)}
        />
      </div>
    );
  }

  // Standard Caregiver Workspace (Desktop left rail, mobile bottom bar)
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F2937] dark:bg-gray-900 dark:text-gray-100 flex flex-col">
      {/* Top Header */}
      <AppHeader onOpenAccessibility={() => setIsAccessibilityOpen(true)} />

      {/* Main Container */}
      <div className="flex flex-1">
        {/* Navigation Rail / Tab Bar */}
        <AppNavigation />

        {/* Dynamic Screen Content */}
        <main
          id="main-app-content"
          className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto max-w-7xl mx-auto w-full"
          tabIndex={-1}
        >
          {activeTab === 'dashboard' && <BentoDashboard />}
          {activeTab === 'calendar' && <SharedCareCalendar />}
          {activeTab === 'tasks' && <TaskBoard />}
          {activeTab === 'medications' && <MedicationTracker />}
          {activeTab === 'vault' && <DocumentVault />}
          {activeTab === 'profile' && <CareProfile />}
          {activeTab === 'team' && <CareCircleDirectory />}
          {activeTab === 'feed' && <FamilyTimeline />}
          {activeTab === 'admin' && <CircleRbacManager />}
          {(activeTab === 'security' || activeTab === 'audit') && <HipaaAuditPage />}
          {activeTab === 'billing' && <FamilyPlanPage />}
        </main>
      </div>

      {/* Quick Capture Modal (One-Tap Add) */}
      <QuickCaptureModal />

      {/* Accessibility Toolbar Modal */}
      <AccessibilityToolbar
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <CaregiverProvider>
      <MainAppContent />
    </CaregiverProvider>
  );
}
