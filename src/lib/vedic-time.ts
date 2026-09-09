import SunCalc from "suncalc3";

export interface GeoLocation {
  latitude: number;
  longitude: number;
  name?: string | undefined;
  timezone?: string | undefined;
  timezoneOffset?: number | undefined; // minutes east of UTC (e.g. IST = +330)
}

export interface SunriseSunset {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  nextSunrise: Date;
  prevSunrise: Date;
  prevSunset: Date;
}

export const MUHURTAS_PER_PERIOD = 15;

export interface VedicTime {
  /** False when the sun does not rise/set and proportional geometry is unavailable. */
  solarDataAvailable: boolean;
  // Which half of the ahorātra we are in
  period: "day" | "night";
  // 1-based index within the current period (1–15)
  muhurtaIndex: number;
  // 1-based index within the whole ahorātra (1–30); night starts at 16
  absoluteIndex: number;
  // How far into the current muhūrta, 0–1
  muhurtaProgress: number;
  // Vedic sub-units
  ghati: number;
  pala: number;
  vipala: number;
  // Current muhūrta metadata
  muhurtaName: string;
  // Modern time boundaries of the current muhūrta
  currentMuhurtaStart: Date;
  currentMuhurtaEnd: Date;
  // Source astronomical data
  sunrise: Date;
  sunset: Date;
  nextSunrise: Date;
  /** Boundaries for the active sunrise-to-sunrise ahorātra. */
  cycleStart: Date;
  cycleEnd: Date;
  /** Daylight boundaries belonging to the active ahorātra. */
  dayStart: Date;
  dayEnd: Date;
  solarNoon: Date;
  // Lengths in ms
  dayLength: number;
  nightLength: number;
  muhurtaLength: number;
  // Timezone offset in minutes east of UTC used for display
  timezoneOffset: number;
}

export interface MuhurtaWindow {
  readonly period: "day" | "night";
  readonly position: number;
  readonly start: Date;
  readonly end: Date;
  readonly duration: number;
}

/** Resolve a muhūrta's timestamp window without depending on the current tick. */
export function getMuhurtaWindow(vedicTime: VedicTime, absoluteIndex: number): MuhurtaWindow {
  const normalizedIndex = Math.min(30, Math.max(1, Math.trunc(absoluteIndex)));
  const period = normalizedIndex <= MUHURTAS_PER_PERIOD ? "day" : "night";
  const position = period === "day" ? normalizedIndex : normalizedIndex - MUHURTAS_PER_PERIOD;
  const periodStart = period === "day" ? vedicTime.dayStart : vedicTime.dayEnd;
  const periodEnd = period === "day" ? vedicTime.dayEnd : vedicTime.cycleEnd;
  const duration = (periodEnd.getTime() - periodStart.getTime()) / MUHURTAS_PER_PERIOD;
  const start = new Date(periodStart.getTime() + (position - 1) * duration);
  const end = new Date(start.getTime() + duration);

  return { period, position, start, end, duration };
}

export function getSunriseSunset(date: Date, location: GeoLocation): SunriseSunset {
  const today = new Date(date);
  today.setHours(12, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayTimes = SunCalc.getSunTimes(today, location.latitude, location.longitude);
  const tomorrowTimes = SunCalc.getSunTimes(tomorrow, location.latitude, location.longitude);
  const yesterdayTimes = SunCalc.getSunTimes(yesterday, location.latitude, location.longitude);

  const validEvent = (...events: Array<{ value: Date; valid: boolean } | undefined>) =>
    events.find((event) => event?.valid && Number.isFinite(event.value.getTime()))?.value;

  const sunrise = validEvent(todayTimes.sunriseEnd, todayTimes.sunrise);
  const sunset = validEvent(todayTimes.sunsetStart, todayTimes.sunset);
  const nextSunrise = validEvent(tomorrowTimes.sunriseEnd, tomorrowTimes.sunrise);
  const solarNoon = validEvent(todayTimes.solarNoon);
  const prevSunset = validEvent(yesterdayTimes.sunsetStart, yesterdayTimes.sunset);
  const prevSunrise = validEvent(yesterdayTimes.sunriseEnd, yesterdayTimes.sunrise);

  // At polar latitudes suncalc3 can return finite placeholder timestamps
  // instead of omitting the event. Require a coherent sunrise/sunset sequence
  // before exposing solar geometry; otherwise the dial must stay unavailable.
  const isValidDate = (value: Date | undefined): value is Date =>
    value instanceof Date && Number.isFinite(value.getTime());

  if (
    !isValidDate(sunrise) ||
    !isValidDate(sunset) ||
    !isValidDate(solarNoon) ||
    !isValidDate(nextSunrise) ||
    !isValidDate(prevSunrise) ||
    !isValidDate(prevSunset) ||
    prevSunrise >= prevSunset ||
    prevSunset >= sunrise ||
    sunrise >= sunset ||
    sunset >= nextSunrise ||
    sunset.getTime() - sunrise.getTime() >= 24 * 60 * 60 * 1000 ||
    nextSunrise.getTime() - sunset.getTime() >= 24 * 60 * 60 * 1000
  ) {
    const unavailable = new Date(Number.NaN);
    return {
      sunrise: unavailable,
      sunset: unavailable,
      solarNoon: unavailable,
      nextSunrise: unavailable,
      prevSunrise: unavailable,
      prevSunset: unavailable,
    };
  }

  return { sunrise, sunset, solarNoon, nextSunrise, prevSunrise, prevSunset };
}

export function getVedicTime(date: Date, location: GeoLocation): VedicTime {
  const { sunrise, sunset, solarNoon, nextSunrise, prevSunrise, prevSunset } = getSunriseSunset(
    date,
    location,
  );

  const timezoneOffset = location.timezoneOffset ?? longitudeToTimezoneOffset(location.longitude);
  if (
    ![sunrise, sunset, solarNoon, nextSunrise, prevSunrise, prevSunset].every((value) =>
      Number.isFinite(value.getTime()),
    )
  ) {
    const unavailable = new Date(Number.NaN);
    return {
      solarDataAvailable: false,
      period: "night",
      muhurtaIndex: 1,
      absoluteIndex: 16,
      muhurtaProgress: 0,
      ghati: 0,
      pala: 0,
      vipala: 0,
      muhurtaName: getMuhurtaName(16),
      currentMuhurtaStart: unavailable,
      currentMuhurtaEnd: unavailable,
      sunrise: unavailable,
      sunset: unavailable,
      nextSunrise: unavailable,
      cycleStart: unavailable,
      cycleEnd: unavailable,
      dayStart: unavailable,
      dayEnd: unavailable,
      solarNoon: unavailable,
      dayLength: 0,
      nightLength: 0,
      muhurtaLength: 0,
      timezoneOffset,
    };
  }

  const isCurrentDay = date >= sunrise;
  const dayStart = isCurrentDay ? sunrise : prevSunrise;
  const dayEnd = isCurrentDay ? sunset : prevSunset;
  const activeSolarNoon = isCurrentDay
    ? solarNoon
    : new Date(solarNoon.getTime() - 24 * 60 * 60 * 1000);
  const cycleStart = dayStart;
  const cycleEnd = isCurrentDay ? nextSunrise : sunrise;
  const dayLength = dayEnd.getTime() - dayStart.getTime();
  let period: "day" | "night";
  let periodStart: Date;
  let periodLength: number;
  let msIntoPeriod: number;
  let nightLength: number;

  if (date >= sunrise && date < sunset) {
    period = "day";
    periodStart = sunrise;
    periodLength = dayLength;
    nightLength = nextSunrise.getTime() - sunset.getTime();
    msIntoPeriod = date.getTime() - sunrise.getTime();
  } else if (date < sunrise) {
    // Between last evening's sunset and this morning's sunrise
    period = "night";
    periodStart = prevSunset;
    nightLength = sunrise.getTime() - prevSunset.getTime();
    periodLength = nightLength;
    msIntoPeriod = date.getTime() - prevSunset.getTime();
  } else {
    period = "night";
    periodStart = sunset;
    nightLength = nextSunrise.getTime() - sunset.getTime();
    periodLength = nightLength;
    msIntoPeriod = date.getTime() - sunset.getTime();
  }

  // Day and night are measured separately: each half of the ahorātra holds 15 muhūrtas.
  const muhurtaLength = periodLength / MUHURTAS_PER_PERIOD;
  const rawMuhurtaIndex = msIntoPeriod / muhurtaLength;
  const muhurtaIndex = Math.min(MUHURTAS_PER_PERIOD, Math.max(1, Math.floor(rawMuhurtaIndex) + 1));
  const muhurtaProgress = Math.min(1, Math.max(0, rawMuhurtaIndex - (muhurtaIndex - 1)));
  const absoluteIndex = period === "day" ? muhurtaIndex : MUHURTAS_PER_PERIOD + muhurtaIndex;

  const currentMuhurtaStart = new Date(periodStart.getTime() + (muhurtaIndex - 1) * muhurtaLength);
  const currentMuhurtaEnd = new Date(currentMuhurtaStart.getTime() + muhurtaLength);

  // Ghaṭī/Pala are fixed traditional units measured independently from sunrise.
  // They must not be derived from variable solar muhūrta durations.
  const elapsedSinceSunrise = Math.max(0, date.getTime() - dayStart.getTime());
  const totalGhati = elapsedSinceSunrise / (24 * 60 * 1000);
  const ghati = Math.floor(totalGhati);
  const fractionalGhati = totalGhati - ghati;
  const totalPala = fractionalGhati * 60;
  const pala = Math.floor(totalPala);
  const vipala = Math.floor((totalPala - pala) * 60);

  // The 30 names run continuously: 1–15 by day, 16–30 by night
  const muhurtaName = getMuhurtaName(absoluteIndex);

  return {
    solarDataAvailable: true,
    period,
    muhurtaIndex,
    absoluteIndex,
    muhurtaProgress,
    ghati,
    pala,
    vipala,
    muhurtaName,
    currentMuhurtaStart,
    currentMuhurtaEnd,
    sunrise,
    sunset,
    nextSunrise,
    cycleStart,
    cycleEnd,
    dayStart,
    dayEnd,
    solarNoon: activeSolarNoon,
    dayLength,
    nightLength,
    muhurtaLength,
    timezoneOffset,
  };
}

export function longitudeToTimezoneOffset(longitude: number): number {
  // Rough solar-time offset from longitude, rounded to nearest 30 minutes.
  const rawMinutes = (longitude / 15) * 60;
  return Math.round(rawMinutes / 30) * 30;
}

export function getBrowserTimezoneOffset(): number {
  // Returns minutes east of UTC for the current browser timezone.
  return -new Date().getTimezoneOffset();
}

export function applyTimezoneOffset(date: Date, offsetMinutes: number): Date {
  return new Date(date.getTime() + offsetMinutes * 60000);
}

export function formatTimezoneOffset(offsetMinutes: number): string {
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMinutes);
  const hours = Math.floor(abs / 60);
  const mins = abs % 60;
  return `UTC${sign}${hours}${mins > 0 ? `:${mins.toString().padStart(2, "0")}` : ""}`;
}

const MUHURTA_NAMES = [
  "Rudra",
  "Āhi",
  "Mitra",
  "Pitṛ",
  "Vasu",
  "Vāruṇa",
  "Vāyu",
  "Savitṛ",
  "Viśvedevāḥ",
  "Indra",
  "Indrāgni",
  "Dhātṛ",
  "Puṣan",
  "Tvasṭṛ",
  "Yama",
  "Gandharva",
  "Kṛttikā",
  "Rohiṇī",
  "Mṛgaśīrṣa",
  "Ārdrā",
  "Punarvasu",
  "Puṣya",
  "Āśleṣā",
  "Maghā",
  "Pūrvaphālgunī",
  "Uttaraphālgunī",
  "Hasta",
  "Citrā",
  "Svātī",
  "Viśākhā",
];

function getMuhurtaName(index: number): string {
  const normalized = (((index - 1) % 30) + 30) % 30;
  return MUHURTA_NAMES[normalized]!;
}

export function formatDuration(ms: number): string {
  const minutes = Math.round(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export function formatTime(
  date: Date,
  timezoneOffsetMinutes?: number,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (timezoneOffsetMinutes === undefined) {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      ...options,
    }).format(date);
  }
  // Shift the instant, then render it in UTC so the browser's own timezone
  // is never applied a second time.
  const shifted = applyTimezoneOffset(date, timezoneOffsetMinutes);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    ...options,
    timeZone: "UTC",
  }).format(shifted);
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s.toString().padStart(2, "0")}s`;
  return `${s}s`;
}

export function isBrahmaMuhurta(date: Date, location: GeoLocation): boolean {
  const { sunrise } = getSunriseSunset(date, location);
  if (!Number.isFinite(sunrise.getTime())) return false;
  const brahmaStart = new Date(sunrise.getTime() - 96 * 60 * 1000); // 96 minutes before sunrise
  const brahmaEnd = sunrise;
  return date >= brahmaStart && date < brahmaEnd;
}

export function getAbhijitMuhurta(
  date: Date,
  location: GeoLocation,
): { start: Date; end: Date } | null {
  const { sunrise, sunset } = getSunriseSunset(date, location);
  if (!Number.isFinite(sunrise.getTime()) || !Number.isFinite(sunset.getTime())) return null;
  const dayLength = sunset.getTime() - sunrise.getTime();
  // Abhijit is the 8th muhūrta of the day (index 8, 0-based 7)
  const muhurtaLength = dayLength / MUHURTAS_PER_PERIOD;
  const start = new Date(sunrise.getTime() + 7 * muhurtaLength);
  const end = new Date(start.getTime() + muhurtaLength);
  return { start, end };
}
