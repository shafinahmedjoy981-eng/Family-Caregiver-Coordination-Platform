import React, { useState } from 'react';
import { useCaregiver } from '../../context/CaregiverContext';
import {
  Heart,
  Bell,
  Sliders,
  ShieldCheck,
  ChevronDown,
  UserCheck,
  PhoneCall,
  Eye,
  Sun,
  Moon,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface AppHeaderProps {
  onOpenAccessibility: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenAccessibility }) => {
  const {
    currentUser,
    setCurrentUserById,
    familyCircle,
    careRecipient,
    notifications,
    setActiveTab,
    isSeniorMode,
    setIsSeniorMode,
    highContrast,
    setHighContrast,
    darkMode,
    setDarkMode,
  } = useCaregiver();

  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header
      id="threadwell-header"
      className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-[#FAF8F5]/95 backdrop-blur-md transition-colors dark:border-gray-800 dark:bg-[#111827]/95"
      role="banner"
    >
      <div className="flex h-18 w-full items-center justify-between px-4">
        {/* Brand & Circle Title - Inset with matching horizontal gap as lower sidebar sections */}
        <div className="flex items-center">
          <button
            id="brand-home-button"
            onClick={() => {
              setIsSeniorMode(false);
              setActiveTab('dashboard');
            }}
            className="group flex items-center space-x-2.5 text-left focus-visible:ring-2 focus-visible:ring-[#0F766E] rounded-xl p-1"
            aria-label="Threadwell Home"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E] text-white shadow-sm transition-transform group-hover:scale-105">
              {/* Thread/Leaf Logo mark */}
              <Heart className="h-6 w-6 fill-white/20 text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-inter text-xl font-bold tracking-tight text-[#0F766E] dark:text-[#2DD4BF]">
                  Threadwell
                </span>
                <span className="rounded-full bg-[#CCFBF1] px-2 py-0.5 text-xs font-semibold text-[#0F766E] dark:bg-[#134E4A] dark:text-[#99F6E4]">
                  Family Care
                </span>
              </div>
              <p className="text-xs text-[#4B5563] dark:text-gray-400">
                {careRecipient.preferredName}’s Circle
              </p>
            </div>
          </button>
        </div>

        {/* Center / Right Control Hub - Tight Compact Group Pinned to Far-Right Edge */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Senior View Quick Toggle (Non-AI Eye Icon) */}
          <button
            id="senior-view-toggle-button"
            onClick={() => setIsSeniorMode(!isSeniorMode)}
            className={`h-10 flex items-center space-x-1.5 rounded-xl px-3 text-xs sm:text-sm font-semibold transition-all ${
              isSeniorMode
                ? 'bg-[#E9976B] text-white shadow-sm hover:bg-[#d88457]'
                : 'border border-[#6B9080]/30 bg-white text-[#0F766E] hover:bg-[#CCFBF1]/40 dark:bg-gray-800 dark:text-[#2DD4BF] dark:border-gray-700'
            }`}
            aria-pressed={isSeniorMode}
            title="Switch to large-text, simplified view designed for older adults"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline font-inter">
              {isSeniorMode ? 'Exit Senior View' : 'Senior Mode (Eleanor)'}
            </span>
            <span className="sm:hidden font-inter">
              {isSeniorMode ? 'Exit Senior' : 'Senior View'}
            </span>
          </button>

          {/* Persona Switcher (RBAC Demonstrator) */}
          <div className="relative">
            <button
              id="persona-switcher-button"
              onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
              className="h-10 flex items-center space-x-2 rounded-xl border border-[#E2E8F0] bg-white px-2.5 sm:px-3 text-sm hover:border-[#0F766E] dark:border-gray-700 dark:bg-gray-800"
              aria-expanded={isPersonaMenuOpen}
              aria-haspopup="true"
              aria-label={`Logged in as ${currentUser.name}, role ${currentUser.role}. Click to switch family persona`}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-6 w-6 sm:h-7 sm:w-7 rounded-full object-cover ring-2 ring-[#0F766E]/20"
              />
              <div className="hidden text-left md:block">
                <p className="text-xs font-bold leading-tight text-[#1F2937] dark:text-gray-100">
                  {currentUser.name}
                </p>
                <p className="text-[10px] capitalize text-[#6B9080] dark:text-[#99F6E4]">
                  {currentUser.role === 'admin' ? 'Coordinator (Admin)' : currentUser.role}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-[#4B5563] dark:text-gray-300" aria-hidden="true" />
            </button>

            {isPersonaMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-2xl border border-[#E2E8F0] bg-white p-2 shadow-xl ring-1 ring-black/5 z-50 dark:border-gray-700 dark:bg-gray-800"
                role="menu"
              >
                <div className="px-3 py-2 border-b border-[#E2E8F0] dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-400">
                      Switch Role (RBAC)
                    </span>
                    <span className="rounded bg-[#CCFBF1] px-1.5 py-0.5 text-[10px] font-semibold text-[#0F766E] dark:bg-[#134E4A] dark:text-[#99F6E4]">
                      MFA Active
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4B5563] mt-0.5 dark:text-gray-400">
                    Test permissions & perspectives across the circle
                  </p>
                </div>
                <div className="py-1">
                  {familyCircle.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => {
                        setCurrentUserById(member.id);
                        setIsPersonaMenuOpen(false);
                      }}
                      className={`flex w-full items-center space-x-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                        member.id === currentUser.id
                          ? 'bg-[#CCFBF1]/50 text-[#0F766E] font-bold dark:bg-[#134E4A] dark:text-[#99F6E4]'
                          : 'text-[#1F2937] hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                      }`}
                      role="menuitem"
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{member.name}</p>
                        <p className="text-xs text-[#4B5563] dark:text-gray-400 truncate">
                          {member.relationship}
                        </p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-gray-100 dark:bg-gray-700 text-[#4B5563] dark:text-gray-300 capitalize">
                        {member.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notification Center Trigger */}
          <div className="relative">
            <button
              id="notification-center-button"
              onClick={() => {
                setActiveTab('feed');
                setIsNotifDropdownOpen(!isNotifDropdownOpen);
              }}
              className="relative h-10 w-10 flex items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#1F2937] hover:border-[#0F766E] hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              aria-label={`Notifications, ${unreadCount} unread`}
            >
              <Bell className="h-4.5 w-4.5" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#E9976B] text-[10px] font-bold text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Accessibility Settings Trigger */}
          <button
            id="accessibility-drawer-button"
            onClick={onOpenAccessibility}
            className="h-10 flex items-center space-x-1.5 rounded-xl border border-[#E2E8F0] bg-white px-2.5 sm:px-3 text-xs sm:text-sm font-medium text-[#1F2937] hover:border-[#0F766E] hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            aria-label="Open Accessibility Toolbar (Contrast, Large Fonts, Audio)"
            title="Accessibility settings"
          >
            <Sliders className="h-4 w-4 text-[#0F766E] dark:text-[#2DD4BF]" aria-hidden="true" />
            <span className="hidden lg:inline font-inter">A11y &amp; Contrast</span>
          </button>
        </div>
      </div>
    </header>
  );
};
