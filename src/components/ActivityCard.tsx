import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { Activity } from '../types/activity';

interface ActivityCardProps {
  activity: Activity;
  onToggleComplete: (id: string) => void;
  onRequestDelete: (activity: Activity) => void;
  isRecentlyHighlighted?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onToggleComplete,
  onRequestDelete,
  isRecentlyHighlighted = false,
}) => {
  return (
    <div
      className={`group relative flex items-center justify-between p-3.5 sm:p-4 bg-white rounded-2xl border transition-all duration-200 ${
        isRecentlyHighlighted
          ? 'border-amber-400 bg-amber-50/40 ring-2 ring-amber-300/40 shadow-sm'
          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
      } ${activity.completed ? 'opacity-60 bg-slate-50/60' : ''}`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-2">
        {/* Complete Checkbox Button */}
        <button
          type="button"
          onClick={() => onToggleComplete(activity.id)}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 min-h-[44px] min-w-[44px] -m-2 sm:-m-1.5 p-2 sm:p-1.5 ${
            activity.completed
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
              : 'border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/60 text-transparent hover:text-emerald-600'
          }`}
          aria-label={activity.completed ? `Mark "${activity.title}" as incomplete` : `Mark "${activity.title}" as completed`}
        >
          <div
            className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
              activity.completed
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-300 group-hover:border-slate-400 text-transparent'
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </button>

        {/* Title */}
        <span
          className={`text-sm sm:text-base font-medium truncate ${
            activity.completed
              ? 'text-slate-400 line-through select-none'
              : 'text-slate-800'
          }`}
          title={activity.title}
        >
          {activity.title}
        </span>
      </div>

      {/* Delete Button */}
      <button
        type="button"
        onClick={() => onRequestDelete(activity)}
        className="w-8 h-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer min-h-[44px] min-w-[44px] shrink-0"
        aria-label={`Delete "${activity.title}"`}
        title={`Delete "${activity.title}"`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
