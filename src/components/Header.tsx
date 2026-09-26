import React from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

interface HeaderProps {
  onResetDefaults?: () => void;
  showResetButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onResetDefaults, showResetButton }) => {
  return (
    <header className="w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center text-lg select-none shadow-xs">
            🎲
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
              What Should I Do?
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Stop overthinking. Let chance decide.
            </p>
          </div>
        </div>

        {/* Action Zone */}
        <div className="flex items-center gap-2">
          {showResetButton && onResetDefaults && (
            <button
              onClick={onResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer min-h-[36px]"
              title="Reset with sample activities"
              aria-label="Reset with sample activities"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Reset Samples</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
