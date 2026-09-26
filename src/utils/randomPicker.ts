import { Activity } from '../types/activity';

/**
 * Generates an unbiased random integer in the range [0, max - 1].
 */
function getRandomIndex(max: number): number {
  if (max <= 1) return 0;

  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  }

  return Math.floor(Math.random() * max);
}

/**
 * Randomly selects an activity from the pool of incomplete activities.
 *
 * Rules:
 * 1. Only incomplete activities (completed === false) are eligible.
 * 2. If no incomplete activities exist, returns null.
 * 3. If there is only 1 incomplete activity, returns that one.
 * 4. If there are 2 or more incomplete activities, and `lastPickedId` is provided
 *    and exists in the candidate pool, excludes `lastPickedId` to avoid immediately
 *    repeating the same pick.
 */
export function pickRandomActivity(
  activities: Activity[],
  lastPickedId?: string | null
): Activity | null {
  const incompleteActivities = activities.filter((a) => !a.completed);

  if (incompleteActivities.length === 0) {
    return null;
  }

  if (incompleteActivities.length === 1) {
    return incompleteActivities[0];
  }

  // Filter out the previously picked item if alternatives exist
  let pool = incompleteActivities;
  if (lastPickedId) {
    const candidatesWithoutLast = incompleteActivities.filter((a) => a.id !== lastPickedId);
    if (candidatesWithoutLast.length > 0) {
      pool = candidatesWithoutLast;
    }
  }

  const selectedIndex = getRandomIndex(pool.length);
  return pool[selectedIndex];
}
