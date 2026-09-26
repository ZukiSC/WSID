import React from 'react';
import { Sparkles, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  onAddFirstClick: () => void;
  onLoadPresets?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onAddFirstClick,
  onLoadPresets,
}) => {
  return (
    <div className="w-full py-12 px-6 flex flex-col items-center justify-center text-center bg-white border border-slate-200/80 rounded-3xl shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-3xl flex items-center justify-center mb-4 select-none animate-bounce shadow-xs">
        🎲
      </div>

      <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
        Nothing to choose from yet.
      </h3>

      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        Add a few things you could do and let us decide for you. Stop overthinking!
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        <button
          type="button"
          onClick={onAddFirstClick}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl min-h-[44px] transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add your first activity</span>
        </button>

        {onLoadPresets && (
          <button
            type="button"
            onClick={onLoadPresets}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl min-h-[44px] transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Load sample ideas</span>
          </button>
        )}
      </div>
    </div>
  );
};
