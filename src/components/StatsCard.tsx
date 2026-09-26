import React from 'react';

interface StatsCardProps {
  activeCount: number;
  completedCount: number;
  totalCount: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  activeCount,
  completedCount,
  totalCount,
}) => {
  return (
    <div className="w-full flex items-center justify-between text-xs text-slate-500 py-1.5 px-1 select-none font-medium">
      <div className="flex items-center gap-2">
        <span className="text-slate-800 font-semibold tabular-nums">
          {activeCount}
        </span>
        <span>Active</span>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <span className="text-slate-800 font-semibold tabular-nums">
          {completedCount}
        </span>
        <span>Completed</span>
      </div>
      <div className="flex items-center gap-1.5 text-slate-400">
        <span className="tabular-nums font-medium">{totalCount}</span>
        <span>total</span>
      </div>
    </div>
  );
};
