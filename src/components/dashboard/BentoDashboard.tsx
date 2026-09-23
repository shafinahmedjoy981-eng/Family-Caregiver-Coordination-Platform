import React from 'react';
import { useCaregiver } from '../../context/CaregiverContext';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Pill,
  ArrowRight,
  Shield,
  Heart,
  Users,
  AlertCircle,
  FileText,
  Plus,
  Volume2,
  Phone,
  Car,
  ChevronRight,
} from 'lucide-react';

export const BentoDashboard: React.FC = () => {
  const {
    careRecipient,
    tasks,
    calendarEvents,
    medications,
    activityFeed,
    currentUser,
    claimTask,
    completeTask,
    claimTransportation,
    setActiveTab,
    setIsQuickCaptureOpen,
    speakText,
  } = useCaregiver();

  // Upcoming appointments (sort by date)
  const nextEvent = calendarEvents[0];

  // Open tasks needing attention
  const openTasks = tasks.filter((t) => t.status === 'open').slice(0, 3);
  const myClaimedTasks = tasks.filter((t) => t.status === 'claimed' && t.claimedBy === currentUser.id);

  // Medications today summary
  const totalMeds = medications.length;
  const takenMedsCount = medications.filter((m) =>
    m.adherenceLogs.some((l) => l.date === '2026-09-22' && l.status === 'taken')
  ).length;
  const refillAlertMeds = medications.filter((m) => m.remainingDoses <= m.refillDueThreshold);

  // Recent activity
  const recentActivities = activityFeed.slice(0, 3);

  return (
    <div id="bento-dashboard-view" className="mx-auto max-w-6xl space-y-6">
      {/* Gentle Reassuring Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-white p-6 border border-[#E2E8F0] shadow-xs dark:bg-gray-800 dark:border-gray-700">
        <div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
              Calm Family Command Center
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-bold font-inter tracking-tight text-[#1F2937] dark:text-white sm:text-3xl">
            Good morning, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="mt-1 text-base text-[#4B5563] dark:text-gray-300">
            Everything is calm for {careRecipient.preferredName}. Sibling support is active.
          </p>
        </div>

        {/* Action Button & Read Aloud */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() =>
              speakText(
                `Good morning ${currentUser.name}. Today for Eleanor, morning medications are taken. Visiting aide Elena is assisting at home, and David has claimed the prescription pickup.`
              )
            }
            className="touch-target flex items-center space-x-1.5 rounded-2xl border border-[#E2E8F0] bg-[#FAF8F5] px-4 py-2.5 text-sm font-semibold text-[#1F2937] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            aria-label="Listen to audio morning briefing"
          >
            <Volume2 className="h-4 w-4 text-[#0F766E] dark:text-[#2DD4BF]" />
            <span className="font-inter">Audio Brief</span>
          </button>

          <button
            onClick={() => setIsQuickCaptureOpen(true)}
            className="touch-target flex items-center space-x-2 rounded-2xl bg-[#0F766E] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#0c5f59]"
          >
            <Plus className="h-4 w-4" />
            <span className="font-inter">New Task or Note</span>
          </button>
        </div>
      </div>

      {/* Bento Grid: 4 Core Glanceable Units */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Today's Medication Overview */}
        <div
          id="bento-medication-card"
          className="card-surface flex flex-col justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#CCFBF1] text-[#0F766E] dark:bg-[#134E4A] dark:text-[#99F6E4]">
                  <Pill className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-inter text-[#1F2937] dark:text-white">
                    Medication Routine
                  </h2>
                  <p className="text-xs text-[#4B5563] dark:text-gray-400">
                    Today’s adherence log
                  </p>
                </div>
              </div>
              <span className="flex items-center space-x-1 rounded-full bg-[#16A34A]/10 px-2.5 py-1 text-xs font-bold text-[#16A34A]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>On Track</span>
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-[#FAF8F5] p-3.5 dark:bg-gray-700/50">
                <div>
                  <p className="text-sm font-bold text-[#1F2937] dark:text-gray-200">
                    Morning Window (8:00 AM)
                  </p>
                  <p className="text-xs text-[#4B5563] dark:text-gray-400">
                    Lisinopril 20mg & Calcium
                  </p>
                </div>
                <span className="rounded-lg bg-[#16A34A] px-2.5 py-1 text-xs font-bold text-white flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Taken
                </span>
              </div>

              {refillAlertMeds.length > 0 && (
                <div className="rounded-2xl border border-[#F59E0B]/30 bg-[#FEF3C7]/40 p-3.5 dark:bg-[#78350F]/20">
                  <div className="flex items-start space-x-2">
                    <Clock className="h-4 w-4 text-[#F59E0B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#92400E] dark:text-[#FDE68A]">
                        Refill Due Soon ({refillAlertMeds[0].name})
                      </p>
                      <p className="text-xs text-[#78350F] dark:text-gray-300 mt-0.5">
                        {refillAlertMeds[0].remainingDoses} doses left. David is picking up today!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#E2E8F0] dark:border-gray-700">
            <button
              onClick={() => setActiveTab('medications')}
              className="touch-target flex w-full items-center justify-between text-sm font-bold text-[#0F766E] hover:text-[#0c5f59] dark:text-[#2DD4BF]"
            >
              <span>View Full Medication Tracker</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Card 2: Next Appointment / Visit */}
        <div
          id="bento-appointment-card"
          className="card-surface flex flex-col justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E9976B]/15 text-[#E9976B]">
                  <Calendar className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-inter text-[#1F2937] dark:text-white">
                    Next on the Schedule
                  </h2>
                  <p className="text-xs text-[#4B5563] dark:text-gray-400">
                    Shared Care Calendar
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-[#4B5563] dark:bg-gray-700 dark:text-gray-300">
                Tomorrow
              </span>
            </div>

            {nextEvent ? (
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-[#E2E8F0] p-4 bg-[#FAF8F5] dark:border-gray-700 dark:bg-gray-700/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-base font-bold text-[#1F2937] dark:text-white">
                        {nextEvent.title}
                      </p>
                      <p className="text-xs text-[#6B9080] font-semibold dark:text-[#99F6E4] mt-0.5">
                        {nextEvent.providerName || nextEvent.category}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center space-x-4 text-xs text-[#4B5563] dark:text-gray-300">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5 text-[#0F766E] dark:text-[#2DD4BF]" />
                      <span>{nextEvent.startTime} – {nextEvent.endTime}</span>
                    </span>
                    {nextEvent.location && (
                      <span className="truncate">{nextEvent.location}</span>
                    )}
                  </div>

                  {nextEvent.transportationNeeded && (
                    <div className="mt-3 flex items-center justify-between rounded-xl bg-amber-50 p-2.5 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900">
                      <div className="flex items-center space-x-1.5 text-xs text-amber-800 dark:text-amber-300">
                        <Car className="h-4 w-4" />
                        <span>Driver needed</span>
                      </div>
                      {nextEvent.transportationClaimedBy ? (
                        <span className="text-xs font-bold text-[#16A34A]">
                          ✓ Driven by {nextEvent.transportationClaimedByName}
                        </span>
                      ) : (
                        <button
                          onClick={() => claimTransportation(nextEvent.id)}
                          className="touch-target rounded-lg bg-[#0F766E] px-2.5 py-1 text-xs font-bold text-white shadow-xs"
                        >
                          I can drive
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-[#4B5563]">No upcoming events scheduled.</p>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-[#E2E8F0] dark:border-gray-700">
            <button
              onClick={() => setActiveTab('calendar')}
              className="touch-target flex w-full items-center justify-between text-sm font-bold text-[#0F766E] hover:text-[#0c5f59] dark:text-[#2DD4BF]"
            >
              <span>Open Shared Care Calendar</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Card 3: Care Team On Duty & Emergency */}
        <div
          id="bento-care-team-card"
          className="card-surface flex flex-col justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6B9080]/15 text-[#6B9080]">
                  <Users className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-inter text-[#1F2937] dark:text-white">
                    Active Care Circle
                  </h2>
                  <p className="text-xs text-[#4B5563] dark:text-gray-400">
                    Who is on duty right now
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-[#CCFBF1] px-2.5 py-1 text-xs font-bold text-[#0F766E] dark:bg-[#134E4A] dark:text-[#99F6E4]">
                Home Visit Active
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center space-x-3 rounded-2xl bg-[#FAF8F5] p-3 border border-[#E2E8F0] dark:bg-gray-700/50 dark:border-gray-700">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80"
                  alt="Elena Rivera"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-[#0F766E]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1F2937] dark:text-white truncate">
                    Elena Rivera, CNA
                  </p>
                  <p className="text-xs text-[#4B5563] dark:text-gray-300">
                    At Mom’s house until 1:00 PM
                  </p>
                </div>
                <a
                  href="tel:5556703321"
                  className="touch-target rounded-full bg-white p-2 text-[#0F766E] border border-gray-200 shadow-xs hover:bg-[#CCFBF1] dark:bg-gray-800 dark:border-gray-600"
                  aria-label="Call Elena Rivera"
                >
                  <Phone className="h-4 w-4" />
                </a>
              </div>

              {/* Primary Doctor shortcut */}
              <div className="flex items-center space-x-3 rounded-2xl bg-white p-3 border border-[#E2E8F0] dark:bg-gray-800 dark:border-gray-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-bold text-xs">
                  MD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1F2937] dark:text-white truncate">
                    Dr. Margaret Chen, MD
                  </p>
                  <p className="text-xs text-[#4B5563] dark:text-gray-300">
                    Geriatrician & Primary Provider
                  </p>
                </div>
                <a
                  href="tel:5557214400"
                  className="touch-target rounded-full bg-white p-2 text-[#0F766E] border border-gray-200 shadow-xs hover:bg-[#CCFBF1] dark:bg-gray-800 dark:border-gray-600"
                  aria-label="Call Dr. Chen"
                >
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#E2E8F0] dark:border-gray-700">
            <button
              onClick={() => setActiveTab('team')}
              className="touch-target flex w-full items-center justify-between text-sm font-bold text-[#0F766E] hover:text-[#0c5f59] dark:text-[#2DD4BF]"
            >
              <span>Care Team Directory</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Bento Row: One-Tap Task Claiming & Async Family Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Open Tasks Needing Family Help (One-Tap Claim) - Spans 2 Cols */}
        <div
          id="bento-task-board-preview"
          className="lg:col-span-2 card-surface rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-gray-700">
            <div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF]" />
                <h2 className="text-lg font-bold font-inter text-[#1F2937] dark:text-white">
                  Family Help Board
                </h2>
              </div>
              <p className="text-xs text-[#4B5563] dark:text-gray-400 mt-0.5">
                Tasks waiting for a family volunteer. Tap "I've Got This" to claim.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-bold text-[#0F766E] hover:underline dark:text-[#2DD4BF]"
            >
              View All ({tasks.length})
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {openTasks.length > 0 ? (
              openTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-[#E2E8F0] bg-[#FAF8F5] p-4 transition-all hover:border-[#0F766E]/40 dark:border-gray-700 dark:bg-gray-700/40"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center space-x-2">
                      <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-semibold uppercase text-[#4B5563] border border-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300">
                        {task.category}
                      </span>
                      {task.priority === 'time_sensitive' && (
                        <span className="flex items-center space-x-1 text-xs font-bold text-[#F59E0B]">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Time-Sensitive</span>
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-base font-bold text-[#1F2937] dark:text-white">
                      {task.title}
                    </p>
                    <p className="text-xs text-[#4B5563] dark:text-gray-300 mt-0.5 line-clamp-1">
                      {task.description}
                    </p>
                    <p className="text-xs text-[#6B9080] font-medium mt-1 dark:text-[#99F6E4]">
                      Due by {task.dueDate} {task.dueTime ? `at ${task.dueTime}` : ''}
                    </p>
                  </div>

                  <div className="mt-3 sm:mt-0 flex items-center space-x-2">
                    <button
                      onClick={() => claimTask(task.id)}
                      className="touch-target rounded-xl bg-[#0F766E] px-4 py-2 text-sm font-bold text-white shadow-xs hover:bg-[#0c5f59] focus-visible:ring-2 focus-visible:ring-[#CCFBF1]"
                    >
                      I’ve got this
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#E2E8F0] p-6 text-center text-sm text-[#4B5563] dark:border-gray-700 dark:text-gray-400">
                All tasks are claimed or completed! Your family is in complete harmony.
              </div>
            )}
          </div>
        </div>

        {/* Async Family Feed (Replacing Scattered WhatsApp Threads) */}
        <div
          id="bento-family-feed-preview"
          className="card-surface rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-gray-700">
            <div>
              <h2 className="text-lg font-bold font-inter text-[#1F2937] dark:text-white">
                Family Timeline
              </h2>
              <p className="text-xs text-[#4B5563] dark:text-gray-400">
                Calm updates without group text chaos
              </p>
            </div>
            <button
              onClick={() => setActiveTab('feed')}
              className="text-xs font-bold text-[#0F766E] hover:underline dark:text-[#2DD4BF]"
            >
              Full Feed
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {recentActivities.map((act) => (
              <div key={act.id} className="relative pl-5 border-l-2 border-[#CCFBF1] dark:border-[#134E4A]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1F2937] dark:text-gray-200">
                    {act.authorName}
                  </span>
                  <span className="text-[11px] text-[#4B5563] dark:text-gray-400">
                    {act.timestamp}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#4B5563] dark:text-gray-300 leading-relaxed">
                  {act.content}
                </p>
                {act.cheerCount > 0 && (
                  <span className="mt-1.5 inline-flex items-center space-x-1 rounded-full bg-[#FAF8F5] px-2 py-0.5 text-[10px] font-semibold text-[#0F766E] border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-[#99F6E4]">
                    <Heart className="h-3 w-3 fill-[#0F766E] text-[#0F766E]" />
                    <span>{act.cheerCount} family cheers</span>
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 pt-3 border-t border-[#E2E8F0] dark:border-gray-700">
            <button
              onClick={() => setIsQuickCaptureOpen(true)}
              className="touch-target flex w-full items-center justify-center space-x-1.5 rounded-xl border border-[#E2E8F0] py-2 text-xs font-bold text-[#0F766E] hover:bg-[#CCFBF1]/30 dark:border-gray-700 dark:text-[#2DD4BF]"
            >
              <Heart className="h-3.5 w-3.5" />
              <span>Leave a calm update or note</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
