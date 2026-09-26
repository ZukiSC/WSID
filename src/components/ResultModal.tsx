import React, { useEffect, useState, useRef } from 'react';
import { X, Check, Dices, Sparkles } from 'lucide-react';
import { Activity } from '../types/activity';

interface ResultModalProps {
  isOpen: boolean;
  activity: Activity | null;
  allActiveActivities: Activity[];
  isShuffling: boolean;
  onClose: () => void;
  onPickAgain: () => void;
  onComplete: (activityId: string) => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  activity,
  allActiveActivities,
  isShuffling,
  onClose,
  onPickAgain,
  onComplete,
}) => {
  const [shufflingTitle, setShufflingTitle] = useState('');
  const [completedCelebration, setCompletedCelebration] = useState(false);
  const completeButtonRef = useRef<HTMLButtonElement>(null);

  // Rapid title cycle during shuffling phase (~800ms)
  useEffect(() => {
    if (!isOpen) {
      setCompletedCelebration(false);
      return;
    }

    if (isShuffling && allActiveActivities.length > 0) {
      setCompletedCelebration(false);
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * allActiveActivities.length);
        setShufflingTitle(allActiveActivities[randomIndex].title);
      }, 70);

      return () => clearInterval(interval);
    }
  }, [isOpen, isShuffling, allActiveActivities]);

  // Focus management & Escape key handling
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      if (!isShuffling) {
        completeButtonRef.current?.focus();
      }

      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, isShuffling, onClose]);

  if (!isOpen) return null;

  const handleDidIt = () => {
    if (!activity) return;
    setCompletedCelebration(true);
    onComplete(activity.id);

    // Give user a brief moment to see completion badge before closing
    setTimeout(() => {
      onClose();
      setCompletedCelebration(false);
    }, 700);
  };

  const displayTitle = isShuffling
    ? shufflingTitle || 'Choosing...'
    : activity?.title || 'Nothing selected';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="result-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 relative text-center overflow-hidden transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top decoration beam */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer min-h-[44px] min-w-[44px] -m-1 p-1"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {completedCelebration ? (
          /* Completion State */
          <div className="py-8 animate-scaleUp flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mb-4 shadow-sm animate-bounce">
              🎉
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
              Nice! One thing done.
            </h3>
            <p className="text-sm text-slate-500">
              Activity marked as completed!
            </p>
          </div>
        ) : (
          /* Decision State */
          <div className="flex flex-col items-center">
            {/* Animated Dice Badge */}
            <div
              className={`w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-3xl flex items-center justify-center mb-4 shadow-xs select-none ${
                isShuffling ? 'animate-spin' : 'animate-pulse'
              }`}
            >
              🎲
            </div>

            {/* Subtitle / Kicker */}
            <span
              id="result-modal-title"
              className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2"
            >
              {isShuffling ? 'ROLLING THE DICE...' : 'YOUR NEXT MOVE'}
            </span>

            {/* Picked Activity Title */}
            <div className="min-h-[72px] sm:min-h-[88px] flex items-center justify-center w-full px-2 mb-6">
              <h2
                className={`text-2xl sm:text-3xl font-extrabold text-slate-900 text-balance leading-snug transition-all duration-150 ${
                  isShuffling ? 'opacity-70 blur-[0.5px] scale-98' : 'scale-100'
                }`}
              >
                {displayTitle}
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-3 pt-2">
              {/* Primary Action: I DID IT */}
              <button
                ref={completeButtonRef}
                type="button"
                onClick={handleDidIt}
                disabled={isShuffling || !activity}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-bold text-base rounded-2xl min-h-[52px] shadow-lg shadow-emerald-600/20 transition-all cursor-pointer active:scale-[0.98]"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>I DID IT</span>
              </button>

              {/* Secondary Action: PICK AGAIN */}
              <button
                type="button"
                onClick={onPickAgain}
                disabled={isShuffling || allActiveActivities.length <= 1}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-100 hover:bg-slate-200/90 active:bg-slate-200 disabled:opacity-40 text-slate-800 font-semibold text-sm rounded-2xl min-h-[48px] transition-all cursor-pointer active:scale-[0.98]"
                title={
                  allActiveActivities.length <= 1
                    ? 'Only 1 active activity available'
                    : 'Pick another activity'
                }
              >
                <Dices className="w-4 h-4 text-amber-600" />
                <span>Pick Again</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
