import { useEffect, useState, useCallback } from "react";
import {
  getBrowserTimezoneOffset,
  longitudeToTimezoneOffset,
  type GeoLocation,
} from "@/lib/vedic-time";

const STORAGE_KEY = "vedic-clock-location";

const DEFAULT_LOCATION: GeoLocation = {
  latitude: 28.6139,
  longitude: 77.209,
  name: "New Delhi, India",
  timezone: "Asia/Kolkata",
  timezoneOffset: 330, // IST UTC+5:30
};

function normalizeLocation(loc: GeoLocation): GeoLocation {
  return {
    ...loc,
    timezoneOffset: loc.timezoneOffset ?? longitudeToTimezoneOffset(loc.longitude),
  };
}

function loadStoredLocation(): GeoLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as GeoLocation;
      if (typeof parsed.latitude === "number" && typeof parsed.longitude === "number") {
        return normalizeLocation(parsed);
      }
    }
  } catch {
    // ignore corrupt storage
  }
  return null;
}

function saveStoredLocation(location: GeoLocation) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeLocation(location)));
  } catch {
    // ignore storage errors
  }
}

export function useLocation() {
  // Keep the server and first client render identical. Stored location is
  // applied after hydration so the clock never renders two different trees.
  const [location, setLocationState] = useState<GeoLocation>(DEFAULT_LOCATION);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setLocation = useCallback((loc: GeoLocation) => {
    const normalized = normalizeLocation(loc);
    saveStoredLocation(normalized);
    setLocationState(normalized);
    setError(null);
  }, []);

  const detectLocation = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setError("Geolocation is not available in this browser.");
      return;
    }

    setIsDetecting(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          name: "Current location",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          timezoneOffset: getBrowserTimezoneOffset(),
        });
        setIsDetecting(false);
      },
      (err) => {
        setError(err.message || "Could not detect location.");
        setIsDetecting(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  }, [setLocation]);

  // Try auto-detecting on first mount only if no stored location exists.
  // Permission-denied errors are suppressed so the default location loads quietly.
  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) return;
    const stored = loadStoredLocation();
    if (stored) setLocationState(stored);
    const shouldDetect = !stored || stored.name === "Current location";
    const run = () => {
      setIsDetecting(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const normalized = normalizeLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            name: "Current location",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: getBrowserTimezoneOffset(),
          });
          saveStoredLocation(normalized);
          setLocationState(normalized);
          setIsDetecting(false);
        },
        () => {
          // Silent fallback to default location.
          setIsDetecting(false);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
      );
    };

    if (shouldDetect) {
      run();
      return;
    }
    // A manually chosen place stays put, but if permission is already granted
    // and the user never picked a place, keep coordinates fresh.
    navigator.permissions
      ?.query({ name: "geolocation" as PermissionName })
      .then((status) => {
        if (status.state === "granted" && !stored) run();
      })
      .catch(() => {});
  }, []);

  return { location, setLocation, detectLocation, isDetecting, error };
}
