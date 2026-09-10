import {
  PanchangaCalculator,
  type CivilDate,
  type Location,
  type TimelineSegment,
  type Panchanga as HoraPanchanga,
} from "@siva-sh/hora";
import type { GeoLocation, VedicTime } from "@/lib/vedic-time";

export type Ayanamsha = "lahiri";
export type DayBoundary = "local-sunrise";

export interface Panchanga {
  readonly isProvisional: boolean;
  readonly vara: string;
  readonly tithi: string;
  /** Completion of the active Tithi, expressed as a percentage. */
  readonly tithiProgress: number | null;
  /** Exact instant at which the active Tithi changes. */
  readonly tithiValidUntil: Date | null;
  readonly prahar: string;
  readonly nakshatra: string;
  readonly yoga: string;
  readonly karana: string;
}

export interface PanchangaRequest {
  readonly instantUtc: Date;
  readonly latitude: number;
  readonly longitude: number;
  readonly timeZoneId: string;
  readonly utcOffset?: number;
  readonly ayanamsha: Ayanamsha;
  readonly dayBoundary: DayBoundary;
}

export interface PanchangaSnapshot extends Panchanga {
  readonly key: string;
  readonly validFrom: Date;
  readonly validUntil: Date;
  readonly source: "@siva-sh/hora / Swiss Ephemeris";
  readonly convention: {
    readonly ayanamsha: Ayanamsha;
    readonly dayBoundary: DayBoundary;
    readonly timeZoneId: string;
    readonly utcOffset?: number;
  };
}

export interface PanchangaProvider {
  getSnapshot(request: PanchangaRequest, vedicTime: VedicTime): Promise<PanchangaSnapshot>;
}

const DEFAULT_PANCHANGA: Panchanga = Object.freeze({
  isProvisional: true,
  vara: "—",
  tithi: "Loading…",
  tithiProgress: null,
  tithiValidUntil: null,
  prahar: "—",
  nakshatra: "Loading…",
  yoga: "Loading…",
  karana: "Loading…",
});

/** Deterministic SSR content; the browser replaces this with the ephemeris snapshot. */
export function getInitialPanchanga(vedicTime: VedicTime): Panchanga {
  return Object.freeze({ ...DEFAULT_PANCHANGA, prahar: getPrahar(vedicTime) });
}

/** Client-side adapter for the bundled Swiss Ephemeris implementation. */
export class HoraPanchangaProvider implements PanchangaProvider {
  private dailyCache = new Map<
    string,
    { daily: HoraPanchanga; following: HoraPanchanga; timeline: TimelineSegment[] }
  >();
  private calculatorPromise: Promise<PanchangaCalculator> | undefined;
  private createCalculator: () => Promise<PanchangaCalculator>;
  constructor(
    createCalculator = () => PanchangaCalculator.create({ ayanamsha: "lahiri", offline: true }),
  ) {
    this.createCalculator = createCalculator;
  }

  async getSnapshot(request: PanchangaRequest, vedicTime: VedicTime): Promise<PanchangaSnapshot> {
    const calculator = await this.getCalculator();
    const location: Location =
      request.utcOffset !== undefined
        ? {
            latitude: request.latitude,
            longitude: request.longitude,
            utcOffset: request.utcOffset / 60,
          }
        : {
            latitude: request.latitude,
            longitude: request.longitude,
            timeZone: request.timeZoneId,
          };
    const anchorDate =
      request.utcOffset !== undefined
        ? toCivilDate(new Date(vedicTime.dayStart.getTime() + request.utcOffset * 60000), "UTC")
        : toCivilDate(vedicTime.dayStart, request.timeZoneId);
    const cacheKey = JSON.stringify([anchorDate, location]);
    let cached = this.dailyCache.get(cacheKey);
    if (!cached) {
      cached = {
        daily: calculator.calculate(anchorDate, location, { riseSetMethod: "swiss" }),
        following: calculator.calculate(shiftCivilDate(anchorDate, 1), location, {
          riseSetMethod: "swiss",
        }),
        timeline: calculator.timeline(anchorDate, location, { riseSetMethod: "swiss" }),
      };
      if (this.dailyCache.size > 8) this.dailyCache.clear();
      this.dailyCache.set(cacheKey, cached);
    }
    const { daily, following, timeline } = cached;
    const active = timeline.filter(
      (segment) => segment.start <= request.instantUtc && request.instantUtc < segment.end,
    );
    const activeTithi = active.find((segment) => segment.limb === "tithi");
    // Timeline segments are clipped to sunrise. Do not present that clipping
    // boundary as a lunar transition or a full-tithi percentage.
    const tithiIndex = activeTithi?.index ?? daily.tithi.index;
    const actualTithi =
      tithiIndex === daily.tithi.index
        ? daily.tithi
        : following.tithi.index === tithiIndex
          ? following.tithi
          : null;
    const tithiValidUntil =
      actualTithi && !actualTithi.bounded
        ? actualTithi.endsAt
        : activeTithi && activeTithi.end < following.sunrise
          ? new Date(activeTithi.end)
          : null;
    const tithiProgress = null;
    const valueFor = (limb: "tithi" | "nakshatra" | "yoga" | "karana", fallback: string) =>
      active.find((segment) => segment.limb === limb)?.name ?? fallback;
    const transition = active.reduce(
      (soonest, segment) => Math.min(soonest, segment.end.getTime()),
      vedicTime.cycleEnd.getTime(),
    );

    return Object.freeze({
      isProvisional: false,
      vara: daily.vara.name,
      key: makeSnapshotKey(request),
      tithi: `${(activeTithi?.index ?? daily.tithi.index) < 15 ? "Śukla" : "Kṛṣṇa"} ${TITHI_NAMES[(activeTithi?.index ?? daily.tithi.index) % 15] === "Pūrṇimā" && (activeTithi?.index ?? daily.tithi.index) >= 15 ? "Amāvasyā" : TITHI_NAMES[(activeTithi?.index ?? daily.tithi.index) % 15]}`,
      tithiProgress,
      tithiValidUntil,
      prahar: getPrahar(vedicTime),
      nakshatra: valueFor("nakshatra", daily.nakshatra.name),
      yoga: valueFor("yoga", daily.yoga.name),
      karana: valueFor("karana", daily.karana.name),
      validFrom: new Date(request.instantUtc),
      validUntil: new Date(Math.max(request.instantUtc.getTime(), transition)),
      source: "@siva-sh/hora / Swiss Ephemeris",
      convention: {
        ayanamsha: request.ayanamsha,
        dayBoundary: request.dayBoundary,
        timeZoneId: request.timeZoneId,
      },
    });
  }

  private getCalculator() {
    this.calculatorPromise ??= this.createCalculator();
    return this.calculatorPromise;
  }
}

const defaultProvider: PanchangaProvider = new HoraPanchangaProvider();

/** Compatibility facade used by Today while keeping the provider injectable. */
export function getPanchanga(
  date: Date,
  vedicTime: VedicTime,
  location: GeoLocation,
  provider: PanchangaProvider = defaultProvider,
): Promise<PanchangaSnapshot> {
  if (!vedicTime.solarDataAvailable)
    return Promise.reject(new Error("Solar boundaries unavailable"));
  return provider.getSnapshot(
    {
      instantUtc: date,
      latitude: location.latitude,
      longitude: location.longitude,
      timeZoneId: location.timezone ?? "UTC",
      ...(!location.timezone ? { utcOffset: vedicTime.timezoneOffset } : {}),
      ayanamsha: "lahiri",
      dayBoundary: "local-sunrise",
    },
    vedicTime,
  );
}

function toCivilDate(date: Date, timeZone: string): CivilDate {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return {
    year: Number(values["year"]),
    month: Number(values["month"]),
    day: Number(values["day"]),
  };
}

function shiftCivilDate(date: CivilDate, days: number): CivilDate {
  const shifted = new Date(Date.UTC(date.year, date.month - 1, date.day + days));
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

function sameCivilDate(left: CivilDate, right: CivilDate): boolean {
  return left.year === right.year && left.month === right.month && left.day === right.day;
}

function makeSnapshotKey(request: PanchangaRequest): string {
  return [
    request.instantUtc.toISOString(),
    request.latitude,
    request.longitude,
    request.timeZoneId,
    request.ayanamsha,
    request.dayBoundary,
  ].join("|");
}

function getPrahar(time: VedicTime): string {
  const quarter = Math.min(
    4,
    Math.floor(((time.muhurtaIndex - 1 + time.muhurtaProgress) / 15) * 4) + 1,
  );
  return `${time.period === "day" ? "Day" : "Night"} Prahar ${quarter}`;
}

const TITHI_NAMES = [
  "Pratipadā",
  "Dvitīyā",
  "Tṛtīyā",
  "Caturthī",
  "Pañcamī",
  "Ṣaṣṭhī",
  "Saptamī",
  "Aṣṭamī",
  "Navamī",
  "Daśamī",
  "Ekādaśī",
  "Dvādaśī",
  "Trayodaśī",
  "Caturdaśī",
  "Pūrṇimā",
];
