import { useEffect, useState, useCallback } from "react";

export interface DisplayPreferences {
  showSanskrit: boolean;
  showModernRange: boolean;
  showQuality: boolean;
  showSubUnits: boolean;
  simplifiedMode: boolean;
  visibleUnits: {
    muhurta: boolean;
    ghati: boolean;
    pala: boolean;
    vipala: boolean;
  };
}

const STORAGE_KEY = "vedic-clock-preferences";

const DEFAULT_PREFERENCES: DisplayPreferences = {
  showSanskrit: true,
  showModernRange: true,
  showQuality: true,
  showSubUnits: true,
  simplifiedMode: false,
  visibleUnits: {
    muhurta: true,
    ghati: true,
    pala: true,
    vipala: false,
  },
};

function loadStoredPreferences(): DisplayPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DisplayPreferences>;
      return {
        ...DEFAULT_PREFERENCES,
        ...parsed,
        visibleUnits: { ...DEFAULT_PREFERENCES.visibleUnits, ...parsed.visibleUnits },
      };
    }
  } catch {
    // ignore corrupt storage
  }
  return DEFAULT_PREFERENCES;
}

function saveStoredPreferences(preferences: DisplayPreferences) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // ignore storage errors
  }
}

export function usePreferences() {
  // Keep SSR and the first client render identical. Stored preferences are
  // applied after hydration so returning users cannot trigger a mismatch.
  const [preferences, setPreferencesState] = useState<DisplayPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    setPreferencesState(loadStoredPreferences());
  }, []);

  const setPreferences = useCallback(
    (updater: Partial<DisplayPreferences> | ((prev: DisplayPreferences) => DisplayPreferences)) => {
      setPreferencesState((prev) => {
        const next =
          typeof updater === "function"
            ? updater(prev)
            : {
                ...prev,
                ...updater,
                visibleUnits: { ...prev.visibleUnits, ...updater.visibleUnits },
              };
        saveStoredPreferences(next);
        return next;
      });
    },
    [],
  );

  const setVisibleUnit = useCallback(
    (unit: keyof DisplayPreferences["visibleUnits"], value: boolean) => {
      setPreferences((prev) => ({
        ...prev,
        visibleUnits: { ...prev.visibleUnits, [unit]: value },
      }));
    },
    [setPreferences],
  );

  const resetPreferences = useCallback(() => {
    saveStoredPreferences(DEFAULT_PREFERENCES);
    setPreferencesState(DEFAULT_PREFERENCES);
  }, []);

  return { preferences, setPreferences, setVisibleUnit, resetPreferences };
}
