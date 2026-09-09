import { useMemo } from "react";
import type { VedicTime } from "@/lib/vedic-time";
import { applyTimezoneOffset } from "@/lib/vedic-time";
import { getMuhurtaByIndex } from "@/lib/muhurta-data";

interface MandalaClockProps {
  vedicTime: VedicTime;
  now: Date;
  showSanskrit?: boolean;
  selectedIndex?: number | null;
  onSelect?: (index: number) => void;
}

const VB = 400;
const C = VB / 2;
const OUTER = 166;
const INNER = 146;
const PRAHAR_OUTER = 184;
const PRAHAR_INNER = 174;
const TICK = 196;

export function MandalaClock({
  vedicTime,
  now,
  showSanskrit = true,
  selectedIndex = null,
  onSelect,
}: MandalaClockProps) {
  const solarUnavailable = !vedicTime.solarDataAvailable;
  const isExploring = selectedIndex !== null;
  const displayIndex = selectedIndex ?? vedicTime.absoluteIndex;
  const info = getMuhurtaByIndex(displayIndex);
  const dialStart = solarUnavailable
    ? vedicTime.cycleStart
    : localMidnight(vedicTime.dayStart, vedicTime.timezoneOffset);

  const segments = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const index = i + 1;
        const isNight = index > 15;
        const periodStart = isNight ? vedicTime.dayEnd : vedicTime.dayStart;
        const periodEnd = isNight ? vedicTime.cycleEnd : vedicTime.dayEnd;
        const periodLength = periodEnd.getTime() - periodStart.getTime();
        const periodIndex = isNight ? index - 16 : index - 1;
        const start = new Date(periodStart.getTime() + (periodIndex * periodLength) / 15);
        const end = new Date(periodStart.getTime() + ((periodIndex + 1) * periodLength) / 15);
        const seg = getMuhurtaByIndex(index);
        return {
          index,
          startAngle: timestampToAngle(start, dialStart),
          endAngle: timestampToAngle(end, dialStart),
          start,
          end,
          quality: seg.quality,
          isNight,
          isCurrent: index === vedicTime.absoluteIndex,
          isPast: index < vedicTime.absoluteIndex,
        };
      }),
    [dialStart, vedicTime.dayStart, vedicTime.dayEnd, vedicTime.cycleEnd, vedicTime.absoluteIndex],
  );

  const progressAngle = timestampToAngle(now, dialStart);
  const praharSegments = useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => {
        const isNight = index >= 4;
        const start = isNight ? vedicTime.dayEnd : vedicTime.dayStart;
        const end = isNight ? vedicTime.cycleEnd : vedicTime.dayEnd;
        const duration = (end.getTime() - start.getTime()) / 4;
        return {
          index,
          startAngle: timestampToAngle(
            new Date(start.getTime() + (index % 4) * duration),
            dialStart,
          ),
          endAngle: timestampToAngle(
            new Date(start.getTime() + ((index % 4) + 1) * duration),
            dialStart,
          ),
          isNight,
        };
      }),
    [dialStart, vedicTime.dayStart, vedicTime.dayEnd, vedicTime.cycleEnd],
  );

  if (solarUnavailable) {
    return (
      <div
        className="mx-auto flex aspect-square w-full max-w-[26rem] items-center justify-center rounded-full border border-border/70 bg-card/60 p-10 text-center"
        role="status"
        aria-label="Solar dial unavailable"
      >
        <div>
          <p className="font-display text-2xl text-foreground">Solar dial unavailable</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Sunrise and sunset are not available for this location and date, so proportional arcs
            are hidden.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-[26rem]">
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="w-full"
        role="img"
        aria-labelledby="mandala-title mandala-description"
      >
        <title id="mandala-title">Solar-proportional muhūrta mandala</title>
        <desc id="mandala-description">
          Fifteen daytime muhūrtas from sunrise to sunset and fifteen nighttime muhūrtas from sunset
          to the next sunrise. Gold represents day and blue represents night.
        </desc>
        <defs>
          <radialGradient id="mandalaCore" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="var(--card)" />
            <stop offset="100%" stopColor="var(--secondary)" />
          </radialGradient>
          <linearGradient id="activeSeg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--day)" />
            <stop offset="100%" stopColor="var(--day)" />
          </linearGradient>
        </defs>

        {/* Prahar ring: four timestamp-proportional quarters for day and night. */}
        {praharSegments.map((segment) => (
          <path
            key={`prahar-${segment.index}`}
            d={arc(C, C, PRAHAR_INNER, PRAHAR_OUTER, segment.startAngle, segment.endAngle)}
            fill={segment.isNight ? "var(--night)" : "var(--day)"}
            fillOpacity={0.22}
            stroke="var(--border)"
            strokeWidth={1}
          />
        ))}

        {/* Outer reference ring */}
        <circle
          cx={C}
          cy={C}
          r={TICK}
          fill="none"
          stroke="var(--neutral)"
          strokeWidth={1.5}
          opacity={0.5}
        />
        <circle cx={C} cy={C} r={TICK - 6} fill="none" stroke="var(--border)" strokeWidth={1} />

        {/* Segments */}
        {segments.map((seg) => {
          const isSelected = seg.index === selectedIndex;
          const label = `${seg.isNight ? "Night" : "Day"} muhūrta ${seg.index > 15 ? seg.index - 15 : seg.index} of 15, ${getMuhurtaByIndex(seg.index).name}`;
          return (
            <path
              key={seg.index}
              d={arc(C, C, INNER, OUTER, seg.startAngle, seg.endAngle)}
              fill={seg.isNight ? "var(--night)" : "var(--day)"}
              fillOpacity={
                !isExploring && seg.isPast ? 0.5 : isSelected ? 0.55 : seg.isNight ? 0.18 : 0.3
              }
              stroke={isSelected ? "var(--foreground)" : "var(--border)"}
              strokeWidth={isSelected ? 2 : 0.75}
              strokeDasharray={isSelected ? "4 3" : undefined}
              role="button"
              tabIndex={0}
              aria-label={`Explore ${label}`}
              aria-pressed={isSelected}
              onClick={() => onSelect?.(seg.index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect?.(seg.index);
                }
              }}
              className="mandala-segment"
            />
          );
        })}

        {/* NOW is always live; Explore only changes the selected wedge/detail. */}
        {(() => {
          const tip = polar(C, C, OUTER + 4, progressAngle);
          const base = polar(C, C, INNER - 14, progressAngle);
          return (
            <g aria-label="NOW: current instant">
              <line
                x1={base.x}
                y1={base.y}
                x2={tip.x}
                y2={tip.y}
                stroke="var(--foreground)"
                strokeWidth={3}
                strokeLinecap="round"
              />
              <circle
                cx={tip.x}
                cy={tip.y}
                r={7}
                fill="var(--foreground)"
                stroke="var(--background)"
                strokeWidth={3}
              />
              <text
                x={tip.x}
                y={tip.y - 12}
                textAnchor="middle"
                fill="var(--foreground)"
                fontSize={8}
                fontWeight={700}
                letterSpacing="0.08em"
              >
                NOW
              </text>
            </g>
          );
        })()}

        {/* Core */}
        <circle
          cx={C}
          cy={C}
          r={INNER - 18}
          fill="url(#mandalaCore)"
          stroke="var(--gold)"
          strokeWidth={1.5}
          opacity={0.98}
        />
        <circle
          cx={C}
          cy={C}
          r={INNER - 30}
          fill="none"
          stroke="var(--gold)"
          strokeWidth={1}
          strokeDasharray="3 6"
          opacity={0.6}
        />
      </svg>

      {/* Center readout */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
        {showSanskrit && info.devanagari ? (
          <p className="max-w-[9rem] truncate font-display text-3xl leading-none text-gold sm:text-4xl">
            {info.devanagari}
          </p>
        ) : null}
        <h2 className="mt-2 max-w-[11rem] truncate font-display text-2xl leading-tight text-foreground sm:text-3xl">
          {info.name}
        </h2>
        <p className="mt-3 max-w-[12rem] truncate text-[0.65rem] font-medium tabular-nums tracking-wide text-muted-foreground">
          {vedicTime.ghati} Ghaṭī · {vedicTime.pala} Pala · {vedicTime.vipala} Vipala
        </p>
      </div>
    </div>
  );
}

function timestampToAngle(instant: Date, dialStart: Date): number {
  const dayLength = 24 * 60 * 60 * 1000;
  return ((instant.getTime() - dialStart.getTime()) / dayLength) * 360;
}

function localMidnight(date: Date, timezoneOffset: number): Date {
  const local = applyTimezoneOffset(date, timezoneOffset);
  local.setUTCHours(0, 0, 0, 0);
  return new Date(local.getTime() - timezoneOffset * 60_000);
}

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arc(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
) {
  const so = polar(cx, cy, outerRadius, endAngle);
  const eo = polar(cx, cy, outerRadius, startAngle);
  const si = polar(cx, cy, innerRadius, endAngle);
  const ei = polar(cx, cy, innerRadius, startAngle);
  const large = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M",
    so.x,
    so.y,
    "A",
    outerRadius,
    outerRadius,
    0,
    large,
    0,
    eo.x,
    eo.y,
    "L",
    ei.x,
    ei.y,
    "A",
    innerRadius,
    innerRadius,
    0,
    large,
    1,
    si.x,
    si.y,
    "Z",
  ].join(" ");
}
