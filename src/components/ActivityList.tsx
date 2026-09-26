import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, Trash2 } from 'lucide-react';
import { Activity } from '../types/activity';
import { ActivityCard } from './ActivityCard';

interface ActivityListProps {
  activeActivities: Activity[];
  completedActivities: Activity[];
  onToggleComplete: (id: string) => void;
  onRequestDelete: (activity: Activity) => void;
  onRequestClearCompleted: () => void;
  recentlyHighlightedId?: string | null;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  activeActivities,
  completedActivities,
  onToggleComplete,
  onRequestDelete,
  onRequestClearCompleted,
  recentlyHighlightedId,
}) => {
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(false);

  return (
    <div className="w-full space-y-6">
      {/* Active Activities Section */}
      <section aria-label="Active activities" className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Options ({activeActivities.length})
          </h2>
          <span className="text-xs text-slate-400">
            {activeActivities.length === 0
              ? 'No active options'
              : `${activeActivities.length} available for pick`}
          </span>
        </div>

        {activeActivities.length > 0 ? (
          <div className="space-y-2">
            {activeActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onToggleComplete={onToggleComplete}
                onRequestDelete={onRequestDelete}
                isRecentlyHighlighted={activity.id === recentlyHighlightedId}
              />
            ))}
          </div>
        ) : (
          <div className="p-6 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 text-center">
            <p className="text-xs text-slate-500 font-medium">
              No active activities. Add one above to get picking!
            </p>
          </div>
        )}
      </section>

      {/* Completed Activities Collapsible Section */}
      {completedActivities.length > 0 && (
        <section aria-label="Completed activities" className="pt-2 border-t border-slate-200/80">
          <div className="flex items-center justify-between py-2 px-1">
            <button
              type="button"
              onClick={() => setIsCompletedExpanded((prev) => !prev)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer select-none py-1"
              aria-expanded={isCompletedExpanded}
            >
              {isCompletedExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>Completed</span>
              <span className="text-slate-400">·</span>
              <span className="tabular-nums font-bold text-slate-700">
                {completedActivities.length}
              </span>
            </button>

            {isCompletedExpanded && (
              <button
                type="button"
                onClick={onRequestClearCompleted}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium hover:underline cursor-pointer"
              >
                Clear completed
              </button>
            )}
          </div>

          {isCompletedExpanded && (
            <div className="space-y-2 mt-2 animate-fadeIn">
              {completedActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onToggleComplete={onToggleComplete}
                  onRequestDelete={onRequestDelete}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
