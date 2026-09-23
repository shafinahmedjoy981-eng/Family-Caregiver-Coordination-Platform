import React, { useState } from 'react';
import { useCaregiver } from '../../context/CaregiverContext';
import {
  CheckSquare,
  Clock,
  User,
  Plus,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Stethoscope,
  Home,
  Utensils,
  Smile,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { CareTask, TaskCategory, TaskPriority } from '../../types';

export const TaskBoard: React.FC = () => {
  const {
    tasks,
    addTask,
    claimTask,
    unclaimTask,
    completeTask,
    currentUser,
    familyCircle,
    setIsQuickCaptureOpen,
  } = useCaregiver();

  const [activeTab, setActiveTab] = useState<'open' | 'my_tasks' | 'all' | 'completed'>('open');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('errand');
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [dueDate, setDueDate] = useState('2026-09-23');
  const [dueTime, setDueTime] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const getCategoryMeta = (cat: TaskCategory) => {
    switch (cat) {
      case 'medical':
        return { label: 'Medical / Health', icon: Stethoscope, color: 'text-teal-700 bg-teal-50 border-teal-200 dark:bg-teal-950/40 dark:text-[#2DD4BF] dark:border-teal-800' };
      case 'errand':
        return { label: 'Errands & Shopping', icon: ShoppingBag, color: 'text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800' };
      case 'meals':
        return { label: 'Meals & Groceries', icon: Utensils, color: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' };
      case 'household':
        return { label: 'Household & Safety', icon: Home, color: 'text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800' };
      case 'social':
        return { label: 'Social & Visits', icon: Smile, color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' };
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (activeTab === 'open') return t.status === 'open';
    if (activeTab === 'my_tasks') return t.claimedBy === currentUser.id || t.assignedTo === currentUser.id;
    if (activeTab === 'completed') return t.status === 'completed';
    return true; // 'all'
  });

  const openCount = tasks.filter((t) => t.status === 'open').length;
  const myCount = tasks.filter((t) => (t.claimedBy === currentUser.id || t.assignedTo === currentUser.id) && t.status !== 'completed').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignedMember = familyCircle.find((m) => m.id === assigneeId);

    addTask({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate,
      dueTime: dueTime || undefined,
      assignedTo: assigneeId || undefined,
      assignedToName: assignedMember?.name,
    });

    setIsAddModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div id="task-board-view" className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800">
        <div>
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
              Delegation & Responsibility
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold font-inter text-[#1F2937] dark:text-white">
            Family Task Coordination
          </h1>
          <p className="mt-1 text-sm text-[#4B5563] dark:text-gray-300">
            No dropped balls, no double efforts. Claim what you can handle with one tap.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="touch-target flex items-center space-x-2 rounded-2xl bg-[#0F766E] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#0c5f59]"
        >
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Main Tabs (Open, My Tasks, Completed) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-2xl bg-gray-100 p-1 dark:bg-gray-700" role="tablist">
          <button
            onClick={() => setActiveTab('open')}
            className={`touch-target flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'open'
                ? 'bg-white text-[#0F766E] shadow-xs dark:bg-gray-900 dark:text-[#2DD4BF]'
                : 'text-[#4B5563] hover:text-[#1F2937] dark:text-gray-300'
            }`}
            role="tab"
            aria-selected={activeTab === 'open'}
          >
            <span>Needs Volunteer</span>
            {openCount > 0 && (
              <span className="rounded-full bg-[#E9976B] px-2 py-0.2 text-[10px] font-bold text-white">
                {openCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('my_tasks')}
            className={`touch-target flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'my_tasks'
                ? 'bg-white text-[#0F766E] shadow-xs dark:bg-gray-900 dark:text-[#2DD4BF]'
                : 'text-[#4B5563] hover:text-[#1F2937] dark:text-gray-300'
            }`}
            role="tab"
            aria-selected={activeTab === 'my_tasks'}
          >
            <span>Claimed by Me</span>
            {myCount > 0 && (
              <span className="rounded-full bg-[#CCFBF1] px-2 py-0.2 text-[10px] font-bold text-[#0F766E] dark:bg-[#134E4A] dark:text-[#99F6E4]">
                {myCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`touch-target rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-white text-[#0F766E] shadow-xs dark:bg-gray-900 dark:text-[#2DD4BF]'
                : 'text-[#4B5563] hover:text-[#1F2937] dark:text-gray-300'
            }`}
            role="tab"
            aria-selected={activeTab === 'all'}
          >
            All Circle Tasks ({tasks.length})
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`touch-target rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'completed'
                ? 'bg-white text-[#0F766E] shadow-xs dark:bg-gray-900 dark:text-[#2DD4BF]'
                : 'text-[#4B5563] hover:text-[#1F2937] dark:text-gray-300'
            }`}
            role="tab"
            aria-selected={activeTab === 'completed'}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Category filter pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          {['all', 'errand', 'medical', 'meals', 'household'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`touch-target rounded-lg px-3 py-1.5 font-semibold capitalize transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#0F766E] text-white'
                  : 'bg-white text-[#4B5563] border border-[#E2E8F0] hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
              }`}
            >
              {cat === 'all' ? 'All Types' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const meta = getCategoryMeta(task.category);
            const CategoryIcon = meta.icon;
            const isCompleted = task.status === 'completed';
            const isClaimedByMe = task.claimedBy === currentUser.id;
            const isClaimedByOther = task.claimedBy && task.claimedBy !== currentUser.id;

            return (
              <div
                key={task.id}
                className={`rounded-3xl border bg-white p-6 shadow-xs transition-all dark:bg-gray-800 ${
                  isCompleted
                    ? 'border-[#E2E8F0] opacity-75 dark:border-gray-700'
                    : task.priority === 'time_sensitive'
                    ? 'border-[#F59E0B]/40 dark:border-[#F59E0B]/30'
                    : 'border-[#E2E8F0] hover:shadow-md dark:border-gray-700'
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${meta.color}`}
                      >
                        <CategoryIcon className="h-3 w-3" />
                        <span>{meta.label}</span>
                      </span>

                      {task.priority === 'time_sensitive' && !isCompleted && (
                        <span className="inline-flex items-center space-x-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-[#F59E0B] border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800">
                          <Clock className="h-3 w-3" />
                          <span>Time-Sensitive</span>
                        </span>
                      )}

                      <span className="text-xs text-[#4B5563] dark:text-gray-300">
                        Due: {task.dueDate} {task.dueTime ? `at ${task.dueTime}` : ''}
                      </span>
                    </div>

                    <h2
                      className={`mt-2 text-lg font-bold font-inter ${
                        isCompleted
                          ? 'line-through text-gray-500 dark:text-gray-400'
                          : 'text-[#1F2937] dark:text-white'
                      }`}
                    >
                      {task.title}
                    </h2>

                    {task.description && (
                      <p className="mt-1 text-sm text-[#4B5563] dark:text-gray-300 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Assignee / Claimed badge */}
                    <div className="mt-3 flex items-center space-x-2 text-xs text-[#4B5563] dark:text-gray-400">
                      <span>Posted by {task.createdByName}</span>
                      <span>•</span>
                      {isCompleted ? (
                        <span className="font-bold text-[#16A34A] flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Completed by {task.completedByName} ({task.completedAt})
                        </span>
                      ) : task.claimedByName ? (
                        <span className="font-semibold text-[#0F766E] dark:text-[#2DD4BF] flex items-center gap-1">
                          <User className="h-3.5 w-3.5" /> Covered by {task.claimedByName}
                        </span>
                      ) : (
                        <span className="font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full dark:bg-amber-950/40 dark:text-amber-300">
                          Open for anyone in the family
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center space-x-2.5 shrink-0 pt-2 sm:pt-0 border-t border-[#E2E8F0] sm:border-t-0 dark:border-gray-700">
                    {!isCompleted ? (
                      <>
                        {task.status === 'open' && (
                          <button
                            onClick={() => claimTask(task.id)}
                            className="touch-target flex items-center space-x-1.5 rounded-xl bg-[#0F766E] px-4 py-2 text-sm font-bold text-white shadow-xs hover:bg-[#0c5f59]"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>I’ve got this</span>
                          </button>
                        )}

                        {isClaimedByMe && (
                          <>
                            <button
                              onClick={() => completeTask(task.id)}
                              className="touch-target flex items-center space-x-1 rounded-xl bg-[#16A34A] px-4 py-2 text-sm font-bold text-white shadow-xs hover:bg-green-700"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Mark Done</span>
                            </button>

                            <button
                              onClick={() => unclaimTask(task.id)}
                              className="touch-target text-xs text-[#4B5563] hover:text-red-600 dark:text-gray-400"
                              title="Release task back to circle"
                            >
                              Release
                            </button>
                          </>
                        )}

                        {isClaimedByOther && (
                          <span className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-[#4B5563] dark:bg-gray-700 dark:text-gray-300">
                            Claimed by {task.claimedByName?.split(' ')[0]}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="flex items-center space-x-1 text-xs font-bold text-[#16A34A]">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>All Set</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-3xl border border-dashed border-[#E2E8F0] p-12 text-center dark:border-gray-700">
            <CheckSquare className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-base font-bold text-[#1F2937] dark:text-white">
              No tasks in this category
            </p>
            <p className="text-xs text-[#4B5563] mt-1 dark:text-gray-400">
              Your family is caught up. Tap "New Task" if anything comes up for Mom.
            </p>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-bold font-inter text-[#1F2937] dark:text-white">
              Post a New Family Care Task
            </h2>
            <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Schedule lawn mowing before Sunday visit"
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 text-base dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Details & Notes
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Include any specific brand, store or instruction..."
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="errand">Errand</option>
                    <option value="medical">Medical / Health</option>
                    <option value="meals">Meals & Food</option>
                    <option value="household">Household / Safety</option>
                    <option value="social">Social / Visit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#4B5563] dark:text-gray-300">
                  Assign To
                </label>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
                  Post Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
