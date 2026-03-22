/**
 * Auto-assign algorithm utilities.
 *
 * Supports two assignment methods:
 *   - round_robin: rotates evenly through all eligible recruiters.
 *   - weighted:    distributes proportionally to each recruiter's performance
 *                  score, guaranteeing correct long-run ratios (e.g. 5★ vs 3★
 *                  → 5 leads for A per every 3 for B).
 *
 * State is persisted in localStorage so the rotation survives page reloads.
 */

export type AutoAssignMethod = 'round_robin' | 'weighted';

export interface AssignableUser {
  id: number;
  /** Performance score 0–100. Defaults to 50 when unknown. */
  score: number;
}

interface AutoAssignState {
  roundRobinIndex: number;
  /** weighted method: how many times each userId has been assigned so far */
  weightedCounts: Record<number, number>;
  /** weighted method: total assignments made (used to compute expected counts) */
  totalAssigned: number;
}

const storageKey = (companyId: number) => `df_autoAssign_${companyId}`;

function loadState(companyId: number): AutoAssignState {
  if (typeof window === 'undefined') {
    return { roundRobinIndex: 0, weightedCounts: {}, totalAssigned: 0 };
  }
  try {
    const raw = localStorage.getItem(storageKey(companyId));
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors
  }
  return { roundRobinIndex: 0, weightedCounts: {}, totalAssigned: 0 };
}

function saveState(companyId: number, state: AutoAssignState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey(companyId), JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

/**
 * Pick the next recruiter to receive an applicant.
 *
 * For weighted: uses a deficit-based algorithm (similar to Bresenham's line)
 * that guarantees the long-run assignment ratio exactly matches the score ratio.
 *
 * Example (5★ : 3★):
 *   overallScore A = 83, B = 50 → after 8 assignments: A=5, B=3.
 */
export function pickNextUser(
  users: AssignableUser[],
  method: AutoAssignMethod,
  companyId: number
): number | null {
  if (!users.length) return null;

  const state = loadState(companyId);
  let chosenId: number;

  if (method === 'round_robin') {
    const idx = state.roundRobinIndex % users.length;
    chosenId = users[idx].id;
    state.roundRobinIndex = idx + 1;
  } else {
    // Weighted by performance score
    state.totalAssigned += 1;
    const totalScore = users.reduce((sum, u) => sum + Math.max(1, u.score), 0);

    // Pick the user whose actual count is furthest below their expected count
    let maxDeficit = -Infinity;
    chosenId = users[0].id;

    users.forEach((u) => {
      const actual = state.weightedCounts[u.id] ?? 0;
      const expected = (Math.max(1, u.score) / totalScore) * state.totalAssigned;
      const deficit = expected - actual;
      if (deficit > maxDeficit) {
        maxDeficit = deficit;
        chosenId = u.id;
      }
    });

    state.weightedCounts[chosenId] = (state.weightedCounts[chosenId] ?? 0) + 1;
  }

  saveState(companyId, state);
  return chosenId;
}
