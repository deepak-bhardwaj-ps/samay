import { useEffect, useMemo, useState } from "react";
import { getVedicTime, type GeoLocation } from "@/lib/vedic-time";
import { getPanchanga, type PanchangaSnapshot } from "@/lib/panchanga";

export function useSamayTime(location: GeoLocation) {
  const [now, setNow] = useState<Date | null>(null);
  const [panchanga, setPanchanga] = useState<PanchangaSnapshot | null>(null);
  const [lunarError, setLunarError] = useState(false);
  const [retry, setRetry] = useState(0);
  const time = useMemo(() => (now ? getVedicTime(now, location) : null), [now, location]);
  useEffect(() => {
    const tick = () => {
      if (!document.hidden) setNow(new Date());
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let pending = false;
    setPanchanga(null);
    setLunarError(false);
    const update = async () => {
      if (pending) return;
      if (document.hidden) {
        timer = setTimeout(update, 60000);
        return;
      }
      pending = true;
      const instant = new Date();
      try {
        const result = await getPanchanga(instant, getVedicTime(instant, location), location);
        if (cancelled) return;
        setPanchanga(result);
        setLunarError(false);
        timer = setTimeout(
          update,
          Math.max(1000, Math.min(60000, result.validUntil.getTime() - Date.now())),
        );
      } catch {
        if (cancelled) return;
        setLunarError(true);
        timer = setTimeout(update, 60000);
      } finally {
        pending = false;
      }
    };
    const resume = () => {
      if (!document.hidden) {
        clearTimeout(timer);
        void update();
      }
    };
    void update();
    document.addEventListener("visibilitychange", resume);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [location, retry]);
  return { now, time, panchanga, lunarError, retryLunar: () => setRetry((value) => value + 1) };
}
