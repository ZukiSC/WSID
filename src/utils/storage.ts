import { Activity } from '../types/activity';

const STORAGE_KEY = 'what_should_i_do_activities_v1';

export const INITIAL_DEFAULT_ACTIVITIES: Activity[] = [
  
];

/**
 * Loads activities from browser localStorage.
 * Falls back to default activities on first launch, or empty array if corrupted.
 */
export function loadActivities(): Activity[] {
  if (typeof window === 'undefined') {
    return INITIAL_DEFAULT_ACTIVITIES;
  }

  try {
    const rawData = window.localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      // First time user: initialize with helpful starter activities
      saveActivities(INITIAL_DEFAULT_ACTIVITIES);
      return INITIAL_DEFAULT_ACTIVITIES;
    }

    const parsed = JSON.parse(rawData);
    if (Array.isArray(parsed)) {
      // Validate structure of items
      const validActivities: Activity[] = parsed.filter(
        (item): item is Activity =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.id === 'string' &&
          typeof item.title === 'string' &&
          typeof item.completed === 'boolean'
      );
      return validActivities;
    }
    return [];
  } catch (err) {
    console.error('Failed to load activities from localStorage:', err);
    return [];
  }
}

/**
 * Saves activities to browser localStorage safely.
 */
export function saveActivities(activities: Activity[]): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    return true;
  } catch (err) {
    console.error('Failed to save activities to localStorage:', err);
    return false;
  }
}

/**
 * Clears stored activities from localStorage.
 */
export function clearActivities(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear activities in localStorage:', err);
  }
}
