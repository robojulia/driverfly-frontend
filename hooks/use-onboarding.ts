import { useCallback, useEffect, useRef, useState } from 'react';
import { UserPreferenceCategory } from '../enums/users/user-preference-category.enum';
import { UserPreferenceOnboardingLabel } from '../enums/users/user-preference-onboarding-label.enum';
import UserApi from '../pages/api/user';
import { useAuth } from './use-auth';
import useStorage from './use-storage';

export type OnboardingState = {
  welcomeSeen?: boolean;
  // undefined until the user shows or hides the checklist themselves; new accounts see it by default
  showChecklist?: boolean;
  // checklist steps with nothing to detect from data are complete once the user opens them
  visited?: string[];
};

const NEW_ACCOUNT_DAYS = 30;

export function isNewAccount(createdAt?: Date | string) {
  if (!createdAt) return false;
  const created = new Date(createdAt).getTime();
  if (isNaN(created)) return false;
  return Date.now() - created < NEW_ACCOUNT_DAYS * 24 * 60 * 60 * 1000;
}

/**
 * Per-user "getting started" state. Saved as a user preference so it follows the user across
 * devices, with a localStorage copy so it still works if the preference cannot be saved.
 */
export function useOnboarding() {
  const { user, isImpersonating } = useAuth();
  const { getItem, setItem } = useStorage();
  const userId = user?.id;
  const storageKey = `onboarding_${userId}`;

  const [state, setState] = useState<OnboardingState>(null);
  const stateRef = useRef<OnboardingState>(null);
  const prefIdRef = useRef<number>(null);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    let local: OnboardingState = {};
    try {
      local = JSON.parse(getItem(storageKey) || '{}') || {};
    } catch (e) {
      local = {};
    }

    (async () => {
      let server: OnboardingState = null;
      try {
        const [pref] = await new UserApi().preferences.list(userId, {
          category: UserPreferenceCategory.ONBOARDING,
          label: UserPreferenceOnboardingLabel.GETTING_STARTED,
        });
        if (pref) {
          prefIdRef.current = pref.id;
          server = typeof pref.value === 'object' ? pref.value : null;
        }
      } catch (e) {
        console.error('Failed to load onboarding state:', e);
      }

      if (cancelled) return;
      const merged: OnboardingState = {
        ...local,
        ...(server || {}),
        visited: Array.from(new Set([...(local.visited || []), ...(server?.visited || [])])),
      };
      stateRef.current = merged;
      setState(merged);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const save = useCallback(
    (patch: OnboardingState) => {
      if (!userId || !stateRef.current) return;

      const next = { ...stateRef.current, ...patch };
      stateRef.current = next;
      setState(next);

      // An impersonating super admin should not change the user's own onboarding progress.
      if (isImpersonating) return;

      setItem(storageKey, JSON.stringify(next));

      // Serialize writes so a quick second change never races the first create.
      saveQueue.current = saveQueue.current.then(async () => {
        const api = new UserApi();
        const value = stateRef.current;
        try {
          if (prefIdRef.current) {
            await api.preferences.update(userId, prefIdRef.current, { value });
          } else {
            const created = await api.preferences.create(userId, {
              category: UserPreferenceCategory.ONBOARDING,
              label: UserPreferenceOnboardingLabel.GETTING_STARTED,
              value,
            });
            prefIdRef.current = created?.id;
          }
        } catch (e) {
          console.error('Failed to save onboarding state:', e);
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId, isImpersonating]
  );

  const markVisited = useCallback(
    (key: string) => {
      const visited = stateRef.current?.visited || [];
      if (!visited.includes(key)) save({ visited: [...visited, key] });
    },
    [save]
  );

  return {
    loaded: state !== null,
    state: state || {},
    isNewAccount: isNewAccount(user?.created_at),
    save,
    markVisited,
  };
}
