import React, { useState } from 'react';
import { useCaregiver } from '../../context/CaregiverContext';
import {
  X,
  CheckSquare,
  Calendar,
  Pill,
  MessageSquareHeart,
  FilePlus,
  Clock,
  User,
  Shield,
  AlertCircle,
} from 'lucide-react';
import { TaskCategory, TaskPriority, EventCategory, TimeSlot, DocumentCategory } from '../../types';

export const QuickCaptureModal: React.FC = () => {
  const {
    isQuickCaptureOpen,
    setIsQuickCaptureOpen,
    addTask,
    addCalendarEvent,
    logMedicationDose,
    addActivityPost,
    addVaultDocument,
    medications,
    familyCircle,
    canEdit,
  } = useCaregiver();

  const [activeTab, setActiveTab] = useState<'task' | 'event' | 'med' | 'note'>('task');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('errand');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('normal');
  const [taskDueDate, setTaskDueDate] = useState('2026-09-23');
  const [taskDueTime, setTaskDueTime] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');

  // Event form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<EventCategory>('appointment');
  const [eventDate, setEventDate] = useState('2026-09-24');
  const [eventStartTime, setEventStartTime] = useState('10:00 AM');
  const [eventEndTime, setEventEndTime] = useState('11:00 AM');
  const [eventLocation, setEventLocation] = useState('');
  const [eventNotes, setEventNotes] = useState('');
  const [needsTransport, setNeedsTransport] = useState(false);

  // Medication log state
  const [selectedMedId, setSelectedMedId] = useState(medications[0]?.id || '');
  const [medTimeSlot, setMedTimeSlot] = useState<TimeSlot>('afternoon');
  const [medStatus, setMedStatus] = useState<'taken' | 'skipped' | 'snoozed'>('taken');
  const [medNote, setMedNote] = useState('');

  // Note state
  const [noteContent, setNoteContent] = useState('');

  if (!isQuickCaptureOpen) return null;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const assignedPerson = familyCircle.find((m) => m.id === taskAssignee);

    addTask({
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      category: taskCategory,
      priority: taskPriority,
      dueDate: taskDueDate,
      dueTime: taskDueTime || undefined,
      assignedTo: taskAssignee || undefined,
      assignedToName: assignedPerson?.name,
    });

    setIsQuickCaptureOpen(false);
    // Reset form
    setTaskTitle('');
    setTaskDesc('');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    addCalendarEvent({
      title: eventTitle.trim(),
      category: eventCategory,
      date: eventDate,
      startTime: eventStartTime,
      endTime: eventEndTime,
      location: eventLocation.trim() || undefined,
      notes: eventNotes.trim() || undefined,
      attendees: ['Eleanor Vance'],
      transportationNeeded: needsTransport,
    });

    setIsQuickCaptureOpen(false);
    setEventTitle('');
  };

  const handleLogMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedId) return;

    logMedicationDose(selectedMedId, medTimeSlot, medStatus, medNote.trim() || undefined);
    setIsQuickCaptureOpen(false);
  };

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    addActivityPost(noteContent.trim(), 'family_note', 'Family Update');
    setIsQuickCaptureOpen(false);
    setNoteContent('');
  };

  return (
    <div
      id="quick-capture-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-capture-title"
    >
      <div
        id="quick-capture-dialog"
        className="relative w-full max-w-lg rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-2xl transition-all dark:border-gray-700 dark:bg-gray-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 dark:border-gray-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
              One-Tap Capture
            </span>
            <h2 id="quick-capture-title" className="text-xl font-bold font-inter text-[#1F2937] dark:text-white">
              Add to Mom’s Care Circle
            </h2>
          </div>
          <button
            onClick={() => setIsQuickCaptureOpen(false)}
            className="touch-target rounded-full p-2 text-[#4B5563] hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Close Quick Capture"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Type Tabs */}
        <div className="mt-4 flex rounded-2xl bg-gray-100 p-1 dark:bg-gray-800" role="tablist">
          <button
            onClick={() => setActiveTab('task')}
            className={`touch-target flex flex-1 items-center justify-center space-x-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
              activeTab === 'task'
                ? 'bg-white text-[#0F766E] shadow-sm dark:bg-gray-900 dark:text-[#2DD4BF]'
                : 'text-[#4B5563] hover:text-[#1F2937] dark:text-gray-400'
            }`}
            role="tab"
            aria-selected={activeTab === 'task'}
          >
            <CheckSquare className="h-4 w-4" />
            <span>Task</span>
          </button>

          <button
            onClick={() => setActiveTab('event')}
            className={`touch-target flex flex-1 items-center justify-center space-x-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
              activeTab === 'event'
                ? 'bg-white text-[#0F766E] shadow-sm dark:bg-gray-900 dark:text-[#2DD4BF]'
                : 'text-[#4B5563] hover:text-[#1F2937] dark:text-gray-400'
            }`}
            role="tab"
            aria-selected={activeTab === 'event'}
          >
            <Calendar className="h-4 w-4" />
            <span>Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('med')}
            className={`touch-target flex flex-1 items-center justify-center space-x-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
              activeTab === 'med'
                ? 'bg-white text-[#0F766E] shadow-sm dark:bg-gray-900 dark:text-[#2DD4BF]'
                : 'text-[#4B5563] hover:text-[#1F2937] dark:text-gray-400'
            }`}
            role="tab"
            aria-selected={activeTab === 'med'}
          >
            <Pill className="h-4 w-4" />
            <span>Log Dose</span>
          </button>

          <button
            onClick={() => setActiveTab('note')}
            className={`touch-target flex flex-1 items-center justify-center space-x-1.5 rounded-xl py-2 text-xs font-bold transition-all ${
              activeTab === 'note'
                ? 'bg-white text-[#0F766E] shadow-sm dark:bg-gray-900 dark:text-[#2DD4BF]'
                : 'text-[#4B5563] hover:text-[#1F2937] dark:text-gray-400'
            }`}
            role="tab"
            aria-selected={activeTab === 'note'}
          >
            <MessageSquareHeart className="h-4 w-4" />
            <span>Update</span>
          </button>
        </div>

        {/* Tab 1: New Task */}
        {activeTab === 'task' && (
          <form onSubmit={handleCreateTask} className="mt-5 space-y-4">
            <div>
              <label htmlFor="task-title-input" className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                What needs to be done? *
              </label>
              <input
                id="task-title-input"
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Pick up eye drops from Walgreens"
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-base text-[#1F2937] focus:border-[#0F766E] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="task-category-select" className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Category
                </label>
                <select
                  id="task-category-select"
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value as TaskCategory)}
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="errand">Errand</option>
                  <option value="medical">Medical / Health</option>
                  <option value="meals">Meals & Food</option>
                  <option value="household">Household / Safety</option>
                  <option value="social">Social / Visit</option>
                </select>
              </div>

              <div>
                <label htmlFor="task-due-date" className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Due Date
                </label>
                <input
                  id="task-due-date"
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="task-assignee" className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                Assign to Family Member (or leave Open for anyone to claim)
              </label>
              <select
                id="task-assignee"
                value={taskAssignee}
                onChange={(e) => setTaskAssignee(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Leave Open (Anyone can claim with 1 tap)</option>
                {familyCircle
                  .filter((m) => m.role !== 'senior')
                  .map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.relationship})
                    </option>
                  ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="touch-target w-full rounded-xl bg-[#0F766E] px-4 py-3 text-base font-bold text-white shadow-sm hover:bg-[#0c5f59]"
              >
                Post Task to Circle
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Calendar Event */}
        {activeTab === 'event' && (
          <form onSubmit={handleCreateEvent} className="mt-5 space-y-4">
            <div>
              <label htmlFor="event-title-input" className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                Event / Appointment Title *
              </label>
              <input
                id="event-title-input"
                type="text"
                required
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="e.g. Dr. Sterling Orthopedic Followup"
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-base text-[#1F2937] focus:border-[#0F766E] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="event-category-select" className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Type
                </label>
                <select
                  id="event-category-select"
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value as EventCategory)}
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="appointment">Doctor Appointment</option>
                  <option value="therapy">Therapy (PT/OT)</option>
                  <option value="visit">Family / Aide Visit</option>
                  <option value="social">Social / Outing</option>
                </select>
              </div>

              <div>
                <label htmlFor="event-date-input" className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Date
                </label>
                <input
                  id="event-date-input"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="event-start-time" className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Time
                </label>
                <input
                  id="event-start-time"
                  type="text"
                  value={eventStartTime}
                  onChange={(e) => setEventStartTime(e.target.value)}
                  placeholder="e.g. 10:30 AM"
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="event-location" className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Location / Clinic
                </label>
                <input
                  id="event-location"
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="e.g. Valley Joint Institute"
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <label className="flex items-center space-x-2.5 rounded-xl border border-[#E2E8F0] p-3 text-sm font-medium dark:border-gray-700 dark:text-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={needsTransport}
                onChange={(e) => setNeedsTransport(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-gray-300 text-[#0F766E] focus:ring-[#0F766E]"
              />
              <span>Mom will need someone to drive her</span>
            </label>

            <div className="pt-2">
              <button
                type="submit"
                className="touch-target w-full rounded-xl bg-[#0F766E] px-4 py-3 text-base font-bold text-white shadow-sm hover:bg-[#0c5f59]"
              >
                Add to Shared Calendar
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Log Medication */}
        {activeTab === 'med' && (
          <form onSubmit={handleLogMed} className="mt-5 space-y-4">
            <div>
              <label htmlFor="med-select-input" className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                Select Medication
              </label>
              <select
                id="med-select-input"
                value={selectedMedId}
                onChange={(e) => setSelectedMedId(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-3 text-base font-medium dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                {medications.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.dosage} ({m.frequency})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="med-timeslot-select" className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Window
                </label>
                <select
                  id="med-timeslot-select"
                  value={medTimeSlot}
                  onChange={(e) => setMedTimeSlot(e.target.value as TimeSlot)}
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="bedtime">Bedtime</option>
                </select>
              </div>

              <div>
                <label htmlFor="med-status-select" className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Status
                </label>
                <select
                  id="med-status-select"
                  value={medStatus}
                  onChange={(e) => setMedStatus(e.target.value as 'taken' | 'skipped' | 'snoozed')}
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="taken">Taken ✓</option>
                  <option value="skipped">Skipped (with doctor's advice)</option>
                  <option value="snoozed">Postponed for later</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="med-note-input" className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                Optional note (e.g. taken with oatmeal)
              </label>
              <input
                id="med-note-input"
                type="text"
                value={medNote}
                onChange={(e) => setMedNote(e.target.value)}
                placeholder="e.g. Drank full glass of water, felt fine"
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="touch-target w-full rounded-xl bg-[#0F766E] px-4 py-3 text-base font-bold text-white shadow-sm hover:bg-[#0c5f59]"
              >
                Log Adherence Record
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Family Note / Update */}
        {activeTab === 'note' && (
          <form onSubmit={handlePostNote} className="mt-5 space-y-4">
            <div>
              <label htmlFor="family-note-textarea" className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                Share an async update with the family circle
              </label>
              <textarea
                id="family-note-textarea"
                rows={4}
                required
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="e.g. Stopped by Mom’s house today. She was doing her knee stretches and watched her favorite birdfeeder. All calm!"
                className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] p-3 text-base text-[#1F2937] focus:border-[#0F766E] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <p className="text-xs text-[#4B5563] dark:text-gray-400">
              This replaces scattered text threads so all siblings and helpers stay aligned without phone tag.
            </p>
            <div className="pt-2">
              <button
                type="submit"
                className="touch-target w-full rounded-xl bg-[#0F766E] px-4 py-3 text-base font-bold text-white shadow-sm hover:bg-[#0c5f59]"
              >
                Share Update to Family Feed
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
