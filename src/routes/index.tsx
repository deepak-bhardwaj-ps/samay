import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MandalaClock } from "@/components/MandalaClock";
import { TimeReadout } from "@/components/TimeReadout";
import { useLocation } from "@/hooks/use-location";
import { usePreferences } from "@/hooks/use-preferences";
import {
  getVedicTime,
  formatTime,
  formatDuration,
  getMuhurtaWindow,
  type VedicTime,
} from "@/lib/vedic-time";
import { getMuhurtaByIndex, qualityLabel } from "@/lib/muhurta-data";
import { getInitialPanchanga, getPanchanga, type Panchanga } from "@/lib/panchanga";
import { MapPin, Sunrise, Sunset, Sun, Moon, RotateCcw } from "lucide-react";

// Keep the server render and the first client render identical. Live time is
// installed by the effect below immediately after hydration.
const INITIAL_NOW = new Date("2020-01-01T12:00:00.000Z");

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Muhūrta Clock — Vedic Time Today" },
      {
        name: "description",
        content:
          "A live Vedic muhūrta clock based on your local sunrise and sunset. Discover the ancient Indian way of reading time.",
      },
      { property: "og:title", content: "Muhūrta Clock — Vedic Time Today" },
      {
        property: "og:description",
        content: "A live Vedic muhūrta clock based on your local sunrise and sunset.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  const { location } = useLocation();
  const { preferences } = usePreferences();
  const [now, setNow] = useState(INITIAL_NOW);
  const [vedicTime, setVedicTime] = useState<VedicTime>(() => getVedicTime(INITIAL_NOW, location));
  const [isHydrated, setIsHydrated] = useState(false);
  const [viewMode, setViewMode] = useState<"live" | "explore">("live");
  const [exploreIndex, setExploreIndex] = useState<number | null>(null);
  const [panchanga, setPanchanga] = useState<Panchanga>(() => getInitialPanchanga(vedicTime));
  const [explorePanchanga, setExplorePanchanga] = useState<Panchanga>(() =>
    getInitialPanchanga(vedicTime),
  );
  const hasSolarData = vedicTime.solarDataAvailable;
  const exploredMuhurta = exploreIndex !== null ? getMuhurtaByIndex(exploreIndex) : null;
  const exploredWindow =
    vedicTime.solarDataAvailable && exploreIndex !== null
      ? getMuhurtaWindow(vedicTime, exploreIndex)
      : null;
  const displayedPanchanga = viewMode === "explore" ? explorePanchanga : panchanga;

  const beginExplore = (index: number) => {
    setExplorePanchanga(panchanga);
    setViewMode("explore");
    setExploreIndex(index);
  };

  useEffect(() => {
    const tick = () => {
      const current = new Date();
      const nextVedicTime = getVedicTime(current, location);
      setNow(current);
      setVedicTime(nextVedicTime);
      void getPanchanga(current, nextVedicTime, location)
        .then((nextPanchanga) => {
          setPanchanga(nextPanchanga);
          setExplorePanchanga((currentExplore) =>
            currentExplore.isProvisional ? nextPanchanga : currentExplore,
          );
        })
        .catch(() => {});
      setIsHydrated(true);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [location]);

  return (
    <main className="today-shell min-h-[calc(100vh-4rem)] px-4 pb-14 pt-6 sm:px-6 sm:pt-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mx-auto mb-5 max-w-xl px-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link to="/settings" className="location-pill inline-flex" aria-label="Change location">
              <MapPin className="h-3.5 w-3.5 text-gold" />
              <span className="max-w-[12rem] truncate">{location.name ?? "Your location"}</span>
            </Link>
            <p className="text-lg font-semibold tabular-nums text-foreground">
              {formatTime(now, vedicTime.timezoneOffset, { hour: "numeric", minute: "2-digit" })}
            </p>
          </div>
          {hasSolarData ? (
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4">
              <Anchor
                icon={<Sunrise />}
                label="Sūryodaya"
                value={formatTime(vedicTime.sunrise, vedicTime.timezoneOffset)}
              />
              <Anchor
                icon={<Sun />}
                label="Madhyāhna"
                value={formatTime(vedicTime.solarNoon, vedicTime.timezoneOffset)}
              />
              <Anchor
                icon={<Sunset />}
                label="Sūryāsta"
                value={formatTime(vedicTime.sunset, vedicTime.timezoneOffset)}
              />
              <Anchor
                icon={<Moon />}
                label="Next sunrise"
                value={formatTime(vedicTime.nextSunrise, vedicTime.timezoneOffset)}
              />
            </div>
          ) : null}
        </div>

        {/* Main dial */}
        {isHydrated ? (
          <MandalaClock
            vedicTime={vedicTime}
            now={now}
            showSanskrit={preferences.showSanskrit}
            selectedIndex={viewMode === "explore" ? exploreIndex : null}
            onSelect={beginExplore}
          />
        ) : (
          <div className="mx-auto aspect-square w-full max-w-[26rem]" aria-hidden="true" />
        )}

        <div
          className="mx-auto mt-2 flex max-w-xl flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground"
          aria-label="Dial legend"
        >
          <LegendItem color="day" label="Day" />
          <LegendItem color="night" label="Night" />
          <LegendItem color="current" label="Now" />
        </div>

        <div className="mx-auto mt-5 max-w-xl rounded-2xl border border-border/60 bg-card/55 p-4">
          <p className="eyebrow">Current Tithi</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <p className="text-lg font-semibold text-foreground">{displayedPanchanga.tithi}</p>
            {displayedPanchanga.tithiProgress !== null ? (
              <span className="text-sm font-semibold tabular-nums text-gold">
                {Math.round(displayedPanchanga.tithiProgress)}% complete
              </span>
            ) : null}
          </div>
          {displayedPanchanga.tithiValidUntil ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Changes at {formatTime(displayedPanchanga.tithiValidUntil, vedicTime.timezoneOffset)}
            </p>
          ) : null}
        </div>

        {!hasSolarData ? (
          <div
            className="mx-auto mt-4 max-w-xl rounded-2xl border border-neutral/30 bg-neutral/10 px-4 py-3 text-center text-sm text-neutral"
            role="status"
          >
            Solar data is unavailable for this location and date. The proportional dial is hidden
            until sunrise and sunset can be calculated.
          </div>
        ) : null}

        <div className="mx-auto mt-4 max-w-xl">
          {viewMode === "explore" && exploredMuhurta ? (
            <div className="explore-detail mt-3" aria-live="polite">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">
                  Exploring {exploredMuhurta.name}
                </p>
                <span className="rounded-full bg-secondary px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                  {qualityLabel(exploredMuhurta.quality)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{exploredMuhurta.meaning}</p>
              {exploredWindow ? (
                <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-secondary/60 p-3 text-xs sm:grid-cols-4">
                  <ExploreFact
                    label="Position"
                    value={`${exploredWindow.period === "day" ? "Day" : "Night"} ${exploredWindow.position} of 15`}
                  />
                  <ExploreFact
                    label="Starts"
                    value={formatTime(exploredWindow.start, vedicTime.timezoneOffset)}
                  />
                  <ExploreFact
                    label="Ends"
                    value={formatTime(exploredWindow.end, vedicTime.timezoneOffset)}
                  />
                  <ExploreFact label="Duration" value={formatDuration(exploredWindow.duration)} />
                </div>
              ) : null}
              <p className="mt-2 text-[11px] text-gold">
                Paused exploration · the NOW marker remains live
              </p>
              <button
                type="button"
                className="return-now mt-2"
                onClick={() => {
                  setViewMode("live");
                  setExploreIndex(null);
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" /> Return to now
              </button>
            </div>
          ) : null}
        </div>

        <div className="mx-auto mt-5 grid max-w-xl grid-cols-2 gap-2 sm:grid-cols-4">
          <PanchangaCard label="Vāra" value={displayedPanchanga.vara} />
          <PanchangaCard label="Nakshatra" value={displayedPanchanga.nakshatra} />
          <PanchangaCard label="Yoga" value={displayedPanchanga.yoga} />
          <PanchangaCard label="Karaṇa" value={displayedPanchanga.karana} />
        </div>

        <div className="mt-6">
          <TimeReadout
            vedicTime={vedicTime}
            preferences={preferences}
            selectedIndex={viewMode === "explore" ? exploreIndex : null}
          />
        </div>
      </div>
    </main>
  );
}

function ExploreFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Anchor({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="solar-anchor" title={`${label}: ${value}`} aria-label={`${label}: ${value}`}>
      <span className="text-gold">{icon}</span>
      <span className="truncate">{label}</span>
      <strong className="truncate text-foreground">{value}</strong>
    </div>
  );
}

function PanchangaCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string | undefined;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-border/60 bg-background/60 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold leading-snug text-foreground">{value}</p>
      {detail ? <p className="mt-1 text-xs text-gold">{detail}</p> : null}
    </div>
  );
}

function LegendItem({ color, label }: { color: "day" | "night" | "current"; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <i className={`legend-dot legend-dot-${color}`} />
      {label}
    </span>
  );
}
