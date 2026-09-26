import React from 'react';
import { Dices, Sparkles } from 'lucide-react';

interface PickButtonProps {
  onClick: () => void;
  disabled: boolean;
  activeCount: number;
  isShuffling?: boolean;
}

export const PickButton: React.FC<PickButtonProps> = ({
  onClick,
  disabled,
  activeCount,
  isShuffling = false,
}) => {
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || isShuffling}
        className={`w-full relative group overflow-hidden flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-base sm:text-lg transition-all duration-200 cursor-pointer min-h-[56px] ${
          disabled
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/60'
            : 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] border border-amber-400'
        }`}
        aria-label="Pick an activity for me"
      >
        <span
          className={`text-2xl transition-transform duration-300 ${
            isShuffling ? 'animate-spin' : 'group-hover:rotate-12 group-active:rotate-45'
          }`}
          role="img"
          aria-hidden="true"
        >
          🎲
        </span>

        <span className="tracking-wide uppercase font-extrabold text-sm sm:text-base">
          {isShuffling ? 'DECIDING...' : 'PICK FOR ME'}
        </span>

        {!disabled && !isShuffling && (
          <span className="hidden sm:inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-slate-950/10 text-slate-900 font-semibold tabular-nums ml-1">
            {activeCount} {activeCount === 1 ? 'choice' : 'choices'}
          </span>
        )}
      </button>

      {disabled && (
        <p className="text-center text-xs text-slate-400 mt-2">
          Add at least one activity to pick from
        </p>
      )}
    </div>
  );
};
