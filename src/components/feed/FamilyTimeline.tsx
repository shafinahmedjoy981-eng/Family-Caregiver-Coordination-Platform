import React, { useState } from 'react';
import { useCaregiver } from '../../context/CaregiverContext';
import {
  MessageSquareHeart,
  Heart,
  Send,
  Clock,
  User,
  Stethoscope,
  Smile,
  CheckCircle2,
} from 'lucide-react';
import { ActivityType } from '../../types';

export const FamilyTimeline: React.FC = () => {
  const { activityFeed, addActivityPost, cheerActivity, currentUser } = useCaregiver();

  const [newPostContent, setNewPostContent] = useState('');
  const [postType, setPostType] = useState<ActivityType>('family_note');
  const [filterType, setFilterType] = useState<string>('all');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    addActivityPost(
      newPostContent.trim(),
      postType,
      postType === 'family_note' ? 'Family Update' : 'Shift Note'
    );
    setNewPostContent('');
  };

  const filteredFeed = activityFeed.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const getPostTypeBadge = (type: ActivityType) => {
    switch (type) {
      case 'medical_update':
        return { label: 'Medical Update', bg: 'bg-teal-50 text-[#0F766E] border-teal-200 dark:bg-teal-950/40 dark:text-[#2DD4BF] dark:border-teal-800' };
      case 'shift_note':
        return { label: 'Aide Shift Note', bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800' };
      case 'task_completed':
        return { label: 'Task Completed', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' };
      default:
        return { label: 'Family Note', bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800' };
    }
  };

  return (
    <div id="family-timeline-view" className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800">
        <div>
          <div className="flex items-center space-x-2">
            <MessageSquareHeart className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
              Calm Family Stream
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold font-inter text-[#1F2937] dark:text-white">
            Daily Care Timeline
          </h1>
          <p className="mt-1 text-sm text-[#4B5563] dark:text-gray-300">
            A quiet, organized record of Mom’s day without 50 conflicting SMS alerts.
          </p>
        </div>
      </div>

      {/* Share Update Composer */}
      <form
        onSubmit={handlePostSubmit}
        className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="flex items-center space-x-2.5 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-400">
            Post an update as {currentUser.name}
          </span>
          <select
            value={postType}
            onChange={(e) => setPostType(e.target.value as ActivityType)}
            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-[#1F2937] dark:border-gray-700 dark:bg-gray-700 dark:text-white"
          >
            <option value="family_note">Family Note</option>
            <option value="shift_note">Aide Shift Check-in</option>
            <option value="medical_update">Medical / Vitals Note</option>
          </select>
        </div>

        <textarea
          rows={3}
          required
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="e.g. Visited Mom after lunch. Her spirits were high! We looked at old family photo albums and she ate all her soup."
          className="w-full rounded-2xl border border-[#E2E8F0] p-3.5 text-base text-[#1F2937] focus:border-[#0F766E] focus:outline-none dark:border-gray-700 dark:bg-gray-700/60 dark:text-white"
        />

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-[#4B5563] dark:text-gray-400">
            Shared with all {4} active members in Mom’s care circle.
          </p>
          <button
            type="submit"
            className="touch-target flex items-center space-x-1.5 rounded-xl bg-[#0F766E] px-5 py-2 text-sm font-bold text-white shadow-xs hover:bg-[#0c5f59]"
          >
            <Send className="h-4 w-4" />
            <span>Post Update</span>
          </button>
        </div>
      </form>

      {/* Feed Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Timeline' },
          { id: 'family_note', label: 'Family Notes' },
          { id: 'shift_note', label: 'Aide Shift Notes' },
          { id: 'medical_update', label: 'Medical Updates' },
          { id: 'task_completed', label: 'Completed Tasks' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`touch-target rounded-xl px-3.5 py-2 font-semibold whitespace-nowrap transition-colors ${
              filterType === f.id
                ? 'bg-[#0F766E] text-white shadow-xs'
                : 'border border-[#E2E8F0] bg-white text-[#4B5563] hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Feed Stream */}
      <div className="space-y-4">
        {filteredFeed.map((post) => {
          const badge = getPostTypeBadge(post.type);

          return (
            <div
              key={post.id}
              className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-[#0F766E] font-bold text-sm dark:bg-[#134E4A] dark:text-[#99F6E4]">
                    {post.authorName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#1F2937] dark:text-white">
                      {post.authorName}
                    </h2>
                    <p className="text-xs text-[#4B5563] dark:text-gray-400">
                      {post.timestamp}
                    </p>
                  </div>
                </div>

                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>

              <p className="mt-4 text-base text-[#1F2937] dark:text-gray-200 leading-relaxed">
                {post.content}
              </p>

              <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-gray-700 flex items-center justify-between">
                <button
                  onClick={() => cheerActivity(post.id)}
                  className="touch-target flex items-center space-x-1.5 rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-1.5 text-xs font-bold text-[#0F766E] hover:bg-[#CCFBF1]/30 dark:border-gray-700 dark:bg-gray-700 dark:text-[#99F6E4]"
                >
                  <Heart className="h-4 w-4 fill-current" />
                  <span>Cheer ({post.cheerCount})</span>
                </button>

                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Shared across family circle
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
