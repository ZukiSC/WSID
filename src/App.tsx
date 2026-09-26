import React, { useState, useRef } from 'react';
import { useActivities } from './hooks/useActivities';
import { pickRandomActivity } from './utils/randomPicker';
import { Activity } from './types/activity';
import { Header } from './components/Header';
import { StatsCard } from './components/StatsCard';
import { ActivityInput } from './components/ActivityInput';
import { ActivityList } from './components/ActivityList';
import { PickButton } from './components/PickButton';
import { ResultModal } from './components/ResultModal';
import { EmptyState } from './components/EmptyState';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const {
    activities,
    activeActivities,
    completedActivities,
    activeCount,
    completedCount,
    totalCount,
    addActivity,
    deleteActivity,
    toggleComplete,
    markCompleted,
    clearCompleted,
    resetToDefaults,
  } = useActivities();

  // Picker States
  const [pickedActivity, setPickedActivity] = useState<Activity | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [lastPickedId, setLastPickedId] = useState<string | null>(null);
  const [recentlyPickedId, setRecentlyPickedId] = useState<string | null>(null);

  // Deletion Confirmation States
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  const [isClearCompletedConfirmOpen, setIsClearCompletedConfirmOpen] = useState(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const showToast = (message: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Perform Pick Action
  const handlePickForMe = () => {
    if (activeActivities.length === 0) {
      showToast('Add at least one activity to pick from!');
      return;
    }

    setIsResultModalOpen(true);
    setIsShuffling(true);

    // Pick random activity (avoiding last picked if 2+ options)
    const nextPick = pickRandomActivity(activeActivities, lastPickedId);

    // Run short engaging spinning/shuffling animation (800ms)
    setTimeout(() => {
      if (nextPick) {
        setPickedActivity(nextPick);
        setLastPickedId(nextPick.id);
        setRecentlyPickedId(nextPick.id);
      }
      setIsShuffling(false);
    }, 850);
  };

  // Pick Again Action
  const handlePickAgain = () => {
    if (activeActivities.length <= 1) return;

    setIsShuffling(true);
    const nextPick = pickRandomActivity(activeActivities, pickedActivity?.id || lastPickedId);

    setTimeout(() => {
      if (nextPick) {
        setPickedActivity(nextPick);
        setLastPickedId(nextPick.id);
        setRecentlyPickedId(nextPick.id);
      }
      setIsShuffling(false);
    }, 700);
  };

  // Complete Picked Activity
  const handleCompletePicked = (activityId: string) => {
    markCompleted(activityId);
    showToast('🎉 Nice! One thing done.');
  };

  // Delete Handlers
  const handleConfirmDelete = () => {
    if (activityToDelete) {
      deleteActivity(activityToDelete.id);
      if (pickedActivity?.id === activityToDelete.id) {
        setPickedActivity(null);
      }
      setActivityToDelete(null);
    }
  };

  const handleConfirmClearCompleted = () => {
    clearCompleted();
    setIsClearCompletedConfirmOpen(false);
    showToast('Completed activities cleared.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Bar Header */}
      <Header
        onResetDefaults={resetToDefaults}
        showResetButton={totalCount === 0 || completedCount > 0}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-6 sm:py-8 flex flex-col gap-6">
        {/* Statistics & Micro Header */}
        {totalCount > 0 && (
          <StatsCard
            activeCount={activeCount}
            completedCount={completedCount}
            totalCount={totalCount}
          />
        )}

        {/* Input Bar */}
        <section aria-label="Add new activity">
          <ActivityInput onAdd={addActivity} />
        </section>

        {/* Primary CTA - "PICK FOR ME" */}
        {totalCount > 0 && (
          <section aria-label="Decision button" className="pt-1">
            <PickButton
              onClick={handlePickForMe}
              disabled={activeCount === 0}
              activeCount={activeCount}
              isShuffling={isShuffling}
            />
          </section>
        )}

        {/* Activities List or Empty State */}
        <section aria-label="Activity list" className="flex-1">
          {totalCount === 0 ? (
            <EmptyState
              onAddFirstClick={() => {
                const el = document.getElementById('activity-input');
                el?.focus();
              }}
              onLoadPresets={resetToDefaults}
            />
          ) : (
            <ActivityList
              activeActivities={activeActivities}
              completedActivities={completedActivities}
              onToggleComplete={toggleComplete}
              onRequestDelete={(activity) => setActivityToDelete(activity)}
              onRequestClearCompleted={() => setIsClearCompletedConfirmOpen(true)}
              recentlyHighlightedId={recentlyPickedId}
            />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/60 py-4 text-center text-xs text-slate-400 select-none">
        <p>What Should I Do? · Make decisions in seconds</p>
      </footer>

      {/* Result Modal */}
      <ResultModal
        isOpen={isResultModalOpen}
        activity={pickedActivity}
        allActiveActivities={activeActivities}
        isShuffling={isShuffling}
        onClose={() => setIsResultModalOpen(false)}
        onPickAgain={handlePickAgain}
        onComplete={handleCompletePicked}
      />

      {/* Delete Activity Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={!!activityToDelete}
        title={activityToDelete ? `Delete "${activityToDelete.title}"?` : ''}
        description="This will permanently remove the activity from your list."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setActivityToDelete(null)}
      />

      {/* Clear Completed Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={isClearCompletedConfirmOpen}
        title="Clear all completed activities?"
        description="All completed items will be removed permanently."
        confirmLabel="Clear All"
        onConfirm={handleConfirmClearCompleted}
        onCancel={() => setIsClearCompletedConfirmOpen(false)}
      />

      {/* Floating Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-xl flex items-center gap-2 animate-scaleUp border border-slate-700 pointer-events-none"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
