import React, { useState, useRef } from 'react';
import { Plus, Sparkles } from 'lucide-react';

interface ActivityInputProps {
  onAdd: (title: string) => { success: boolean; error?: string };
}

const QUICK_INSPIRATIONS = [
  'Clean my desk',
  'Go for a 15-min walk',
  'Read 10 pages',
  'Stretch for 5 mins',
  'Drink a glass of water',
  'Practice coding',
];

export const ActivityInput: React.FC<ActivityInputProps> = ({ onAdd }) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const result = onAdd(inputValue);
    if (result.success) {
      setInputValue('');
      setErrorMessage(null);
      // Auto re-focus input for fast consecutive additions
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else if (result.error) {
      setErrorMessage(result.error);
    }
  };

  const handleInspirationClick = (idea: string) => {
    const result = onAdd(idea);
    if (!result.success && result.error) {
      setErrorMessage(result.error);
    } else {
      setErrorMessage(null);
    }
    inputRef.current?.focus();
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <label htmlFor="activity-input" className="sr-only">
          What could you do?
        </label>
        <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-sm focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-800/10 transition-all">
          <input
            id="activity-input"
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="What could you do?"
            className="flex-1 bg-transparent px-3.5 py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none min-h-[44px]"
            autoComplete="off"
          />

          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 text-white text-sm font-semibold rounded-xl min-h-[44px] min-w-[76px] transition-all cursor-pointer active:scale-95 disabled:active:scale-100 disabled:cursor-not-allowed shrink-0 shadow-xs"
            aria-label="Add activity"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add</span>
          </button>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mt-2 text-xs font-medium text-rose-600 px-3 flex items-center gap-1.5 animate-fadeIn"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            {errorMessage}
          </div>
        )}
      </form>

      {/* Quick Inspiration Pills */}
      <div className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs text-slate-500">
        <span className="flex items-center gap-1 text-slate-400 shrink-0 font-medium mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Ideas:
        </span>
        {QUICK_INSPIRATIONS.map((idea) => (
          <button
            key={idea}
            type="button"
            onClick={() => handleInspirationClick(idea)}
            className="px-2.5 py-1 bg-slate-100/90 hover:bg-slate-200/90 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 border border-slate-200/60 active:scale-95"
          >
            + {idea}
          </button>
        ))}
      </div>
    </div>
  );
};
