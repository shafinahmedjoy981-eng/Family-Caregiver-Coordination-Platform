import React from 'react';
import { useCaregiver, AppNavTab } from '../../context/CaregiverContext';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Pill,
  Lock,
  MessageSquareHeart,
  FileHeart,
  Users,
  Shield,
  CreditCard,
  Plus,
  HelpCircle,
} from 'lucide-react';

interface NavItem {
  id: AppNavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const AppNavigation: React.FC = () => {
  const { activeTab, setActiveTab, tasks, medications, notifications, setIsQuickCaptureOpen } = useCaregiver();

  const openTasksCount = tasks.filter((t) => t.status === 'open').length;
  const refillNeededCount = medications.filter((m) => m.remainingDoses <= m.refillDueThreshold).length;

  const primaryItems: NavItem[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: openTasksCount },
    { id: 'medications', label: 'Meds', icon: Pill, badge: refillNeededCount },
    { id: 'vault', label: 'Vault', icon: Lock },
  ];

  const secondaryItems: NavItem[] = [
    { id: 'feed', label: 'Family Feed', icon: MessageSquareHeart },
    { id: 'profile', label: 'Care Profile', icon: FileHeart },
    { id: 'team', label: 'Care Team', icon: Users },
    { id: 'admin', label: 'Circle & RBAC', icon: Shield },
    { id: 'security', label: 'HIPAA & Audit', icon: Shield },
    { id: 'billing', label: 'Family Plan', icon: CreditCard },
  ];

  return (
    <>
      {/* Desktop Left Rail Navigation */}
      <aside
        id="desktop-navigation-rail"
        className="hidden md:flex w-64 flex-col border-r border-[#E2E8F0] bg-[#FAF8F5] p-4 shrink-0 transition-colors dark:border-gray-800 dark:bg-[#111827]"
        aria-label="Sidebar Navigation"
      >
        <div className="flex flex-col flex-1">
          {/* Quick Capture Floating Action Bar in sidebar */}
          <button
            id="sidebar-quick-capture-btn"
            onClick={() => setIsQuickCaptureOpen(true)}
            className="group flex w-full items-center justify-center space-x-2.5 rounded-2xl bg-[#0F766E] px-4 py-3 text-base font-bold text-white shadow-md transition-all hover:bg-[#0c5f59] hover:shadow-lg focus-visible:ring-4 focus-visible:ring-[#CCFBF1] dark:bg-[#0F766E] dark:hover:bg-[#134E4A] mb-5 shrink-0"
            aria-label="Quick Capture: Add task, appointment, medication, or family note"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
              <Plus className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="font-inter tracking-wide">Quick Capture</span>
          </button>

          {/* Primary Nav List: Core Modules */}
          <div>
            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-400">
              Core Modules
            </p>
            <nav className="flex flex-col space-y-1" aria-label="Core Navigation">
              {primaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`group flex h-11 w-full items-center justify-between rounded-xl px-3.5 text-left text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#CCFBF1] text-[#0F766E] font-bold shadow-xs dark:bg-[#134E4A] dark:text-[#99F6E4]'
                        : 'text-[#1F2937] hover:bg-[#E2E8F0]/50 hover:text-[#0F766E] dark:text-gray-200 dark:hover:bg-gray-800'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Icon
                        className={`h-5 w-5 shrink-0 transition-colors ${
                          isActive
                            ? 'text-[#0F766E] dark:text-[#2DD4BF]'
                            : 'text-[#4B5563] group-hover:text-[#0F766E] dark:text-gray-400'
                        }`}
                      />
                      <span className="font-inter truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="rounded-full bg-[#E9976B] px-2 py-0.5 text-xs font-bold text-white shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Divider between groups */}
          <div className="my-3.5 border-t border-[#E2E8F0] dark:border-gray-800" />

          {/* Secondary Nav List: Care Coordination */}
          <div>
            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-400">
              Care Coordination
            </p>
            <nav className="flex flex-col space-y-1" aria-label="Secondary Navigation">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`group flex h-11 w-full items-center justify-between rounded-xl px-3.5 text-left text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#CCFBF1] text-[#0F766E] font-bold shadow-xs dark:bg-[#134E4A] dark:text-[#99F6E4]'
                        : 'text-[#4B5563] hover:bg-[#E2E8F0]/50 hover:text-[#1F2937] dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Icon
                        className={`h-5 w-5 shrink-0 transition-colors ${
                          isActive
                            ? 'text-[#0F766E] dark:text-[#2DD4BF]'
                            : 'text-[#4B5563] group-hover:text-[#0F766E] dark:text-gray-400'
                        }`}
                      />
                      <span className="font-inter truncate">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Security & HIPAA Assurance Stamp */}
        <div className="mt-auto pt-4 border-t border-[#E2E8F0] dark:border-gray-800">
          <div className="rounded-xl bg-white p-3 border border-[#E2E8F0] text-xs text-[#4B5563] shadow-xs dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
            <div className="flex items-center space-x-2 text-[#0F766E] dark:text-[#2DD4BF] font-bold">
              <Shield className="h-4 w-4" />
              <span>HIPAA Aligned • AES-256</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed">
              End-to-end encrypted family circle. Data never leaves your family’s control.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Floating Action Button (+) */}
      <div className="fixed bottom-20 right-5 z-40 md:hidden">
        <button
          id="mobile-fab-quick-capture"
          onClick={() => setIsQuickCaptureOpen(true)}
          className="touch-target flex h-14 w-14 items-center justify-center rounded-full bg-[#0F766E] text-white shadow-xl hover:bg-[#0c5f59] focus-visible:ring-4 focus-visible:ring-[#CCFBF1]"
          aria-label="Quick Capture: Add task, appointment or note"
        >
          <Plus className="h-7 w-7" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile Bottom Tab Bar (Max 5 primary items) */}
      <nav
        id="mobile-bottom-nav"
        className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-[#E2E8F0] bg-white/95 backdrop-blur-md px-2 md:hidden dark:border-gray-800 dark:bg-[#111827]/95"
        role="navigation"
        aria-label="Mobile Navigation"
      >
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`touch-target relative flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
                isActive
                  ? 'text-[#0F766E] font-bold dark:text-[#2DD4BF]'
                  : 'text-[#4B5563] hover:text-[#0F766E] dark:text-gray-400'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#E9976B] text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-1 text-[11px] font-inter tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
