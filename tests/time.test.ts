import { test } from "node:test";
import assert from "node:assert/strict";
import { createNodeCalculator } from "@siva-sh/hora/node";
import {
  getVedicTime,
  getMuhurtaWindow,
  getPraharWindow,
  getLocationOffset,
  getFixedDialAngles,
} from "../src/lib/vedic-time.ts";
import { getPanchanga, HoraPanchangaProvider } from "../src/lib/panchanga.ts";
const delhi = { latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata" };
const noon = new Date("2026-09-09T07:00:00Z");

test("all 30 windows partition the active sunrise-to-sunrise cycle", () => {
  const time = getVedicTime(noon, delhi);
  const windows = Array.from({ length: 30 }, (_, i) => getMuhurtaWindow(time, i + 1));
  assert.equal(windows[0]!.start.getTime(), time.cycleStart.getTime());
  assert.ok(Math.abs(windows[29]!.end.getTime() - time.cycleEnd.getTime()) <= 1);
  for (let i = 1; i < 30; i++)
    assert.ok(Math.abs(windows[i]!.start.getTime() - windows[i - 1]!.end.getTime()) <= 1);
  assert.notEqual(windows[0]!.duration, windows[15]!.duration);
});
test("sunrise resets fixed units and switches to the first day muhūrta", () => {
  const anchor = getVedicTime(noon, delhi).sunrise;
  const before = getVedicTime(new Date(anchor.getTime() - 1), delhi);
  const after = getVedicTime(anchor, delhi);
  assert.equal(before.absoluteIndex, 30);
  assert.equal(after.absoluteIndex, 1);
  assert.equal(after.ghati, 0);
  assert.equal(after.pala, 0);
  const later = getVedicTime(new Date(anchor.getTime() + 24 * 60000 + 24 * 1000), delhi);
  assert.equal(later.ghati, 1);
  assert.equal(later.pala, 1);
  const lastVighati = getVedicTime(new Date(anchor.getTime() + 24 * 60000 - 1000), delhi);
  assert.equal(lastVighati.ghati, 0);
  assert.equal(lastVighati.pala, 59);
  const nextGhati = getVedicTime(new Date(anchor.getTime() + 24 * 60000), delhi);
  assert.equal(nextGhati.ghati, 1);
  assert.equal(nextGhati.pala, 0);
});
test("fixed dial hands read the same 60-part scale as the ghaṭī and vighaṭī numbers", () => {
  const elapsed = (35 * 60 + 15) * 24_000;
  const angles = getFixedDialAngles(elapsed);
  assert.equal(angles.ghati, 211.5);
  assert.equal(angles.vighati, 90);
  assert.deepEqual(getFixedDialAngles(0), { ghati: 0, vighati: 0 });
});
test("prahar boundaries are quarters, not groups of four muhūrtas", () => {
  const time = getVedicTime(noon, delhi);
  const boundary = time.dayStart.getTime() + time.dayLength / 4;
  const before = new Date(Math.floor(boundary) - 1),
    after = new Date(Math.ceil(boundary) + 1);
  assert.equal(getPraharWindow(getVedicTime(before, delhi), before).index, 1);
  assert.equal(getPraharWindow(getVedicTime(after, delhi), after).index, 2);
});
test("named timezones follow daylight saving and other locations' civil dates", () => {
  const sydney = { latitude: -33.8688, longitude: 151.2093, timezone: "Australia/Sydney" };
  assert.equal(getLocationOffset(new Date("2026-07-01"), sydney), 600);
  assert.equal(getLocationOffset(new Date("2026-12-01"), sydney), 660);
  const time = getVedicTime(new Date("2026-09-09T15:00:00Z"), sydney);
  assert.equal(time.sunrise.toISOString().slice(0, 10), "2026-09-09");
  assert.equal(time.period, "night");
  assert.ok(time.cycleStart < new Date("2026-09-09T15:00:00Z"));
});
test("polar day does not expose fabricated solar data", () => {
  const time = getVedicTime(new Date("2026-06-21T12:00:00Z"), {
    latitude: 78.22,
    longitude: 15.65,
    timezone: "Arctic/Longyearbyen",
  });
  assert.equal(time.solarDataAvailable, false);
});
test("lunar adapter fixes shifted waning names and does not mistake sunrise clipping for a tithi end", async () => {
  const calculator = await createNodeCalculator({ ayanamsha: "lahiri", offline: true });
  const provider = new HoraPanchangaProvider(async () => calculator);
  const before = new Date("2026-09-09T06:00:00Z");
  const after = new Date("2026-09-09T09:00:00Z");
  const first = await getPanchanga(before, getVedicTime(before, delhi), delhi, provider);
  const second = await getPanchanga(after, getVedicTime(after, delhi), delhi, provider);
  assert.equal(first.tithi, "Kṛṣṇa Trayodaśī");
  assert.equal(second.tithi, "Kṛṣṇa Caturdaśī");
  assert.ok(first.tithiValidUntil! > before && first.tithiValidUntil! < after);
  const nextDaily = calculator.calculate(
    { year: 2026, month: 9, day: 10 },
    { ...delhi, timeZone: delhi.timezone },
    { riseSetMethod: "swiss" },
  );
  assert.equal(second.tithiValidUntil!.getTime(), nextDaily.tithi.endsAt.getTime());
  assert.notEqual(second.tithiValidUntil!.getTime(), nextDaily.sunrise.getTime());
  assert.equal(second.tithiProgress, null);
});
