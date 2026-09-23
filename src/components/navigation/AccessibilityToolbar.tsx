import React from 'react';
import { useCaregiver } from '../../context/CaregiverContext';
import {
  X,
  Type,
  Sun,
  Moon,
  Volume2,
  CheckCircle,
  Eye,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';

interface AccessibilityToolbarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({ isOpen, onClose }) => {
  const {
    highContrast,
    setHighContrast,
    textScale,
    setTextScale,
    darkMode,
    setDarkMode,
    speakText,
    isSeniorMode,
    setIsSeniorMode,
  } = useCaregiver();

  if (!isOpen) return null;

  return (
    <div
      id="accessibility-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-toolbar-title"
    >
      <div
        id="accessibility-toolbar-card"
        className="relative w-full max-w-lg rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 dark:border-gray-700">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#CCFBF1] text-[#0F766E] dark:bg-[#134E4A] dark:text-[#99F6E4]">
              <Eye className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="a11y-toolbar-title" className="text-xl font-bold font-inter text-[#1F2937] dark:text-white">
                Accessibility & Vision Controls
              </h2>
              <p className="text-xs text-[#4B5563] dark:text-gray-400">
                WCAG 2.1 AA/AAA compliance • Elder-friendly typography
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="touch-target rounded-full p-2 text-[#4B5563] hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Close Accessibility Controls"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Controls Body */}
        <div className="mt-5 space-y-6">
          {/* Text Size Scaling */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="text-scale-range" className="text-sm font-bold text-[#1F2937] dark:text-gray-200">
                Text Scaling (Atkinson Hyperlegible)
              </label>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-[#0F766E] dark:bg-gray-800 dark:text-[#2DD4BF]">
                {textScale}% Scale
              </span>
            </div>
            <p className="text-xs text-[#4B5563] mt-1 dark:text-gray-400">
              Scales comfortably up to 200% without breaking layouts.
            </p>
            <div className="mt-3 flex items-center space-x-3">
              <button
                onClick={() => setTextScale(Math.max(100, textScale - 25))}
                className="touch-target rounded-xl border border-[#E2E8F0] bg-gray-50 px-3 py-2 text-sm font-bold text-[#1F2937] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                aria-label="Decrease text size"
                disabled={textScale <= 100}
              >
                <ZoomOut className="h-4 w-4 mr-1 inline" /> Smaller
              </button>

              <div className="flex flex-1 justify-between gap-1">
                {[100, 125, 150, 175, 200].map((scale) => (
                  <button
                    key={scale}
                    onClick={() => setTextScale(scale)}
                    className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                      textScale === scale
                        ? 'bg-[#0F766E] text-white shadow-xs'
                        : 'bg-gray-100 text-[#4B5563] hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {scale}%
                  </button>
                ))}
              </div>

              <button
                onClick={() => setTextScale(Math.min(200, textScale + 25))}
                className="touch-target rounded-xl border border-[#E2E8F0] bg-gray-50 px-3 py-2 text-sm font-bold text-[#1F2937] hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                aria-label="Increase text size"
                disabled={textScale >= 200}
              >
                <ZoomIn className="h-4 w-4 mr-1 inline" /> Larger
              </button>
            </div>
          </div>

          {/* High Contrast Mode for Elderly & Low Vision */}
          <div className="rounded-2xl border border-[#E2E8F0] p-4 bg-[#FAF8F5] dark:border-gray-700 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[#1F2937] text-base dark:text-white">
                  High-Contrast Mode (7:1 AAA)
                </p>
                <p className="text-xs text-[#4B5563] mt-0.5 dark:text-gray-400">
                  Enforces crisp black/white boundaries, thicker borders, and maximum optical contrast for low-vision eyes.
                </p>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`touch-target rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                  highContrast
                    ? 'bg-[#0F766E] text-white'
                    : 'bg-gray-200 text-[#1F2937] dark:bg-gray-700 dark:text-gray-200'
                }`}
                aria-pressed={highContrast}
              >
                {highContrast ? 'ON ✓' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Dark Mode / Night Comfort */}
          <div className="flex items-center justify-between rounded-2xl border border-[#E2E8F0] p-4 bg-[#FAF8F5] dark:border-gray-700 dark:bg-gray-800/50">
            <div>
              <p className="font-bold text-[#1F2937] text-base dark:text-white">
                Night Comfort (Dark Theme)
              </p>
              <p className="text-xs text-[#4B5563] mt-0.5 dark:text-gray-400">
                Deep slate (#111827) background to protect eyes during late-night coordination.
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`touch-target rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                darkMode
                  ? 'bg-[#2DD4BF] text-black font-bold'
                  : 'bg-gray-200 text-[#1F2937] dark:bg-gray-700 dark:text-gray-200'
              }`}
              aria-pressed={darkMode}
            >
              {darkMode ? 'DARK ✓' : 'LIGHT'}
            </button>
          </div>

          {/* Read Aloud / Voice Guidance Demo */}
          <div className="rounded-2xl border border-[#CCFBF1] bg-[#CCFBF1]/30 p-4 dark:border-gray-700 dark:bg-[#134E4A]/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[#0F766E] text-sm dark:text-[#99F6E4]">
                  Voice Readout / Screen Reader Assistant
                </p>
                <p className="text-xs text-[#4B5563] mt-0.5 dark:text-gray-300">
                  Hear current schedule and reminders spoken gently.
                </p>
              </div>
              <button
                onClick={() =>
                  speakText(
                    'Welcome to Threadwell. You are viewing Eleanor Vance’s care circle. Today, Lisinopril medication was taken at 8:15 AM. Next, visiting aide Elena is on duty until 1:00 PM.'
                  )
                }
                className="touch-target flex items-center space-x-1.5 rounded-xl bg-[#0F766E] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0c5f59]"
                aria-label="Speak today's care status aloud"
              >
                <Volume2 className="h-4 w-4" />
                <span>Test Audio</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-[#E2E8F0] pt-4 dark:border-gray-700">
          <button
            onClick={onClose}
            className="touch-target rounded-xl bg-[#0F766E] px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-[#0c5f59]"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
