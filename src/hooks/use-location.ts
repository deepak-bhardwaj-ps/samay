import { Capacitor } from "@capacitor/core";
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
      if (
        Number.isFinite(parsed.latitude) &&
        Math.abs(parsed.latitude) <= 90 &&
        Number.isFinite(parsed.longitude) &&
        Math.abs(parsed.longitude) <= 180
      ) {
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

  const detectLocation = useCallback(async () => {
    if (Capacitor.isNativePlatform()) {
      setIsDetecting(true);
      setError(null);
      try {
        const { Geolocation } = await import("@capacitor/geolocation");
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 10000,
        });
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          name: "Current location",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          timezoneOffset: getBrowserTimezoneOffset(),
        });
      } catch {
        setError(
          "Location could not be read. Choose a city or allow location access in your device settings.",
        );
      } finally {
        setIsDetecting(false);
      }
      return;
    }
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

  useEffect(() => {
    const stored = loadStoredLocation();
    if (stored) setLocationState(stored);
  }, []);

  return { location, setLocation, detectLocation, isDetecting, error };
}
