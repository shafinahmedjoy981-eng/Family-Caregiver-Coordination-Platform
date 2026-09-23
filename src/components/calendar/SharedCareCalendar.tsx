import React, { useState } from 'react';
import { useCaregiver } from '../../context/CaregiverContext';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Car,
  User,
  Plus,
  Filter,
  CheckCircle2,
  Stethoscope,
  Activity,
  HeartHandshake,
  Coffee,
  Check,
} from 'lucide-react';
import { CalendarEvent, EventCategory } from '../../types';

export const SharedCareCalendar: React.FC = () => {
  const {
    calendarEvents,
    addCalendarEvent,
    claimTransportation,
    currentUser,
    careRecipient,
    setIsQuickCaptureOpen,
  } = useCaregiver();

  // View Mental Model Toggle: Chronological (Date-first) vs Category (Topic-first)
  const [viewMode, setViewMode] = useState<'chronological' | 'category'>('chronological');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<EventCategory>('appointment');
  const [newDate, setNewDate] = useState('2026-09-25');
  const [newStartTime, setNewStartTime] = useState('2:00 PM');
  const [newEndTime, setNewEndTime] = useState('3:00 PM');
  const [newLocation, setNewLocation] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newNeedDriver, setNewNeedDriver] = useState(false);

  // Categories helper
  const getCategoryBadge = (category: EventCategory) => {
    switch (category) {
      case 'appointment':
        return {
          label: 'Medical Visit',
          icon: Stethoscope,
          bg: 'bg-teal-50 dark:bg-teal-950/40',
          text: 'text-[#0F766E] dark:text-[#2DD4BF]',
          border: 'border-teal-200 dark:border-teal-800',
        };
      case 'therapy':
        return {
          label: 'Therapy & Rehab',
          icon: Activity,
          bg: 'bg-blue-50 dark:bg-blue-950/40',
          text: 'text-blue-700 dark:text-blue-300',
          border: 'border-blue-200 dark:border-blue-800',
        };
      case 'visit':
        return {
          label: 'Care Aide Visit',
          icon: HeartHandshake,
          bg: 'bg-emerald-50 dark:bg-emerald-950/40',
          text: 'text-emerald-700 dark:text-emerald-300',
          border: 'border-emerald-200 dark:border-emerald-800',
        };
      case 'social':
        return {
          label: 'Family & Social',
          icon: Coffee,
          bg: 'bg-amber-50 dark:bg-amber-950/40',
          text: 'text-amber-800 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-800',
        };
      default:
        return {
          label: 'Care Event',
          icon: CalendarIcon,
          bg: 'bg-gray-50 dark:bg-gray-800',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-200 dark:border-gray-700',
        };
    }
  };

  const filteredEvents = calendarEvents.filter((ev) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'rides_needed') return ev.transportationNeeded && !ev.transportationClaimedBy;
    return ev.category === selectedFilter;
  });

  // Group events for Chronological View
  const sortedEvents = [...filteredEvents].sort((a, b) => a.date.localeCompare(b.date));

  // Group events for Category View
  const categorizedEvents: Record<EventCategory, CalendarEvent[]> = {
    appointment: filteredEvents.filter((e) => e.category === 'appointment'),
    therapy: filteredEvents.filter((e) => e.category === 'therapy'),
    visit: filteredEvents.filter((e) => e.category === 'visit'),
    social: filteredEvents.filter((e) => e.category === 'social'),
    medication: filteredEvents.filter((e) => e.category === 'medication'),
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCalendarEvent({
      title: newTitle.trim(),
      category: newCategory,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      location: newLocation.trim() || undefined,
      providerName: newProvider.trim() || undefined,
      notes: newNotes.trim() || undefined,
      attendees: ['Eleanor Vance'],
      transportationNeeded: newNeedDriver,
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewLocation('');
    setNewProvider('');
    setNewNotes('');
  };

  return (
    <div id="shared-care-calendar-view" className="mx-auto max-w-6xl space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800">
        <div>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
              Unified Family Calendar
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold font-inter text-[#1F2937] dark:text-white">
            Mom’s Schedule & Appointments
          </h1>
          <p className="mt-1 text-sm text-[#4B5563] dark:text-gray-300">
            One calm source of truth for rides, therapy visits, and clinic checkups.
          </p>
        </div>

        {/* View Switcher & Add Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Chronological vs Category toggle */}
          <div
            className="flex rounded-2xl bg-gray-100 p-1 dark:bg-gray-700"
            role="radiogroup"
            aria-label="Calendar Mental Model View"
          >
            <button
              onClick={() => setViewMode('chronological')}
              className={`touch-target rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                viewMode === 'chronological'
                  ? 'bg-white text-[#0F766E] shadow-xs dark:bg-gray-900 dark:text-[#2DD4BF]'
                  : 'text-[#4B5563] hover:text-[#1F2937] dark:text-gray-300'
              }`}
              role="radio"
              aria-checked={viewMode === 'chronological'}
            >
              Date-First (Chronological)
            </button>
            <button
              onClick={() => setViewMode('category')}
              className={`touch-target rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                viewMode === 'category'
                  ? 'bg-white text-[#0F766E] shadow-xs dark:bg-gray-900 dark:text-[#2DD4BF]'
                  : 'text-[#4B5563] hover:text-[#1F2937] dark:text-gray-300'
              }`}
              role="radio"
              aria-checked={viewMode === 'category'}
            >
              Category-First
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="touch-target flex items-center space-x-2 rounded-2xl bg-[#0F766E] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#0c5f59]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Events' },
          { id: 'rides_needed', label: '🚗 Rides Still Needed' },
          { id: 'appointment', label: 'Doctor Appointments' },
          { id: 'therapy', label: 'Physical Therapy' },
          { id: 'visit', label: 'Aide Shifts' },
          { id: 'social', label: 'Social & Visits' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`touch-target rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
              selectedFilter === tab.id
                ? 'bg-[#0F766E] text-white shadow-xs'
                : 'border border-[#E2E8F0] bg-white text-[#4B5563] hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Render View: Chronological Mode */}
      {viewMode === 'chronological' ? (
        <div className="space-y-4">
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event) => {
              const badge = getCategoryBadge(event.category);
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={event.id}
                  className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* Left: Date & Details */}
                    <div className="flex items-start space-x-4">
                      {/* Date Badge */}
                      <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-[#FAF8F5] border border-[#E2E8F0] text-center dark:bg-gray-700 dark:border-gray-600 shrink-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
                          {new Date(event.date + 'T12:00:00').toLocaleDateString('en-US', {
                            weekday: 'short',
                          })}
                        </span>
                        <span className="text-xl font-bold font-inter text-[#1F2937] dark:text-white">
                          {new Date(event.date + 'T12:00:00').getDate()}
                        </span>
                        <span className="text-[10px] text-[#4B5563] dark:text-gray-300">
                          {new Date(event.date + 'T12:00:00').toLocaleDateString('en-US', {
                            month: 'short',
                          })}
                        </span>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
                          >
                            <BadgeIcon className="h-3.5 w-3.5" />
                            <span>{badge.label}</span>
                          </span>

                          <span className="flex items-center space-x-1 text-xs text-[#4B5563] dark:text-gray-300">
                            <Clock className="h-3.5 w-3.5 text-[#0F766E] dark:text-[#2DD4BF]" />
                            <span>{event.startTime} – {event.endTime}</span>
                          </span>
                        </div>

                        <h2 className="mt-1 text-lg font-bold font-inter text-[#1F2937] dark:text-white">
                          {event.title}
                        </h2>

                        {event.providerName && (
                          <p className="text-xs font-semibold text-[#6B9080] dark:text-[#99F6E4]">
                            With {event.providerName}
                          </p>
                        )}

                        {event.location && (
                          <p className="mt-1 flex items-center space-x-1 text-xs text-[#4B5563] dark:text-gray-300">
                            <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                            <span>{event.location}</span>
                          </p>
                        )}

                        {event.notes && (
                          <p className="mt-2 text-xs italic text-[#4B5563] dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-xl">
                            "{event.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Transportation Coordination */}
                    <div className="border-t border-[#E2E8F0] pt-3 md:border-t-0 md:pt-0 shrink-0">
                      {event.transportationNeeded ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-right dark:bg-amber-950/30 dark:border-amber-900">
                          <div className="flex items-center justify-end space-x-1 text-xs font-bold text-amber-900 dark:text-amber-200">
                            <Car className="h-4 w-4" />
                            <span>Transportation Needed</span>
                          </div>
                          {event.transportationClaimedBy ? (
                            <p className="mt-1 text-xs font-bold text-[#16A34A] flex items-center justify-end gap-1">
                              <Check className="h-3.5 w-3.5" /> Driven by {event.transportationClaimedByName}
                            </p>
                          ) : (
                            <div className="mt-2">
                              <button
                                onClick={() => claimTransportation(event.id)}
                                className="touch-target rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0c5f59]"
                              >
                                I can drive Mom
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-[#4B5563] dark:text-gray-400">
                          No transport required (At home)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-3xl border border-dashed border-[#E2E8F0] p-10 text-center dark:border-gray-700">
              <CalendarIcon className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-base font-bold text-[#1F2937] dark:text-white">
                No events match this filter
              </p>
              <p className="text-xs text-[#4B5563] mt-1 dark:text-gray-400">
                Tap "Add Event" to record Mom’s next visit or clinic date.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Render View: Category-First Mental Model */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {(['appointment', 'therapy', 'visit', 'social'] as EventCategory[]).map((cat) => {
            const list = categorizedEvents[cat] || [];
            const badge = getCategoryBadge(cat);
            const BadgeIcon = badge.icon;
            return (
              <div
                key={cat}
                className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-xl ${badge.bg}`}>
                      <BadgeIcon className={`h-4 w-4 ${badge.text}`} />
                    </div>
                    <h2 className="font-inter font-bold text-[#1F2937] dark:text-white">
                      {badge.label}
                    </h2>
                  </div>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-[#4B5563] dark:bg-gray-700 dark:text-gray-300">
                    {list.length} scheduled
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {list.length > 0 ? (
                    list.map((ev) => (
                      <div
                        key={ev.id}
                        className="rounded-2xl border border-[#E2E8F0] bg-[#FAF8F5] p-3.5 dark:border-gray-700 dark:bg-gray-700/50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0F766E] dark:text-[#2DD4BF]">
                            {ev.date} • {ev.startTime}
                          </span>
                          {ev.transportationNeeded && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                              {ev.transportationClaimedBy ? 'Ride Covered' : 'Driver Needed'}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 font-bold text-sm text-[#1F2937] dark:text-white">
                          {ev.title}
                        </p>
                        {ev.location && (
                          <p className="text-xs text-[#4B5563] dark:text-gray-300 truncate mt-0.5">
                            {ev.location}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#4B5563] dark:text-gray-400 italic">
                      None currently scheduled in this category.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-bold font-inter text-[#1F2937] dark:text-white">
              Schedule New Appointment or Visit
            </h2>
            <form onSubmit={handleCreateEvent} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Geriatric Cardiology Followup"
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-base dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EventCategory)}
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="appointment">Doctor Appointment</option>
                    <option value="therapy">Therapy (PT/OT)</option>
                    <option value="visit">Care Aide Shift</option>
                    <option value="social">Family Visit / Social</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                    End Time
                  </label>
                  <input
                    type="text"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Doctor or Provider Name (Optional)
                </label>
                <input
                  type="text"
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                  placeholder="e.g. Dr. Arthur Sterling"
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Location / Address
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. 450 Hospital Blvd, Suite 210"
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <label className="flex items-center space-x-2 text-sm font-medium dark:text-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newNeedDriver}
                  onChange={(e) => setNewNeedDriver(e.target.checked)}
                  className="h-4 w-4 rounded text-[#0F766E]"
                />
                <span>Mom will need someone to drive her</span>
              </label>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="touch-target rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-bold text-[#4B5563] dark:border-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target rounded-xl bg-[#0F766E] px-5 py-2 text-sm font-bold text-white shadow-xs hover:bg-[#0c5f59]"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
