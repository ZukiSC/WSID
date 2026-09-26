import { useState, useEffect, useCallback, useMemo } from 'react';
import { Activity } from '../types/activity';
import { loadActivities, saveActivities, INITIAL_DEFAULT_ACTIVITIES } from '../utils/storage';

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>(() => loadActivities());

  // Keep localStorage synchronized whenever activities change
  useEffect(() => {
    saveActivities(activities);
  }, [activities]);

  const addActivity = useCallback((title: string): { success: boolean; error?: string; activity?: Activity } => {
    const trimmed = title.trim();
    if (!trimmed) {
      return { success: false, error: 'Please enter an activity name.' };
    }

    // Check for exact duplicate in active activities (case-insensitive)
    const isDuplicate = activities.some(
      (a) => !a.completed && a.title.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      return { success: false, error: 'This activity is already on your active list!' };
    }

    const newActivity: Activity = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
    };

    setActivities((prev) => [newActivity, ...prev]);
    return { success: true, activity: newActivity };
  }, [activities]);

  const deleteActivity = useCallback((id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  }, []);

  const markCompleted = useCallback((id: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: true } : a))
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setActivities((prev) => prev.filter((a) => !a.completed));
  }, []);

  const resetToDefaults = useCallback(() => {
    setActivities(INITIAL_DEFAULT_ACTIVITIES);
  }, []);

  const activeActivities = useMemo(
    () => activities.filter((a) => !a.completed),
    [activities]
  );

  const completedActivities = useMemo(
    () => activities.filter((a) => a.completed),
    [activities]
  );

  return {
    activities,
    activeActivities,
    completedActivities,
    activeCount: activeActivities.length,
    completedCount: completedActivities.length,
    totalCount: activities.length,
    addActivity,
    deleteActivity,
    toggleComplete,
    markCompleted,
    clearCompleted,
    resetToDefaults,
  };
}
