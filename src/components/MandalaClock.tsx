import { useId } from "react";
import { getMuhurtaWindow, formatCountdown, type VedicTime } from "@/lib/vedic-time";
import { getMuhurtaByIndex } from "@/lib/muhurta-data";

interface MandalaClockProps {
  vedicTime: VedicTime;
  now: Date;
  showSanskrit?: boolean;
  selectedIndex?: number | null;
  onSelect?: (index: number) => void;
}
const C = 200;
function point(r: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return { x: C + r * Math.cos(radians), y: C + r * Math.sin(radians) };
}
function arc(r: number, start: number, end: number) {
  const a = point(r, start),
    b = point(r, end);
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${end - start > 180 ? 1 : 0} 1 ${b.x} ${b.y}`;
}
/** The geometry is data: 30 proportional muhūrtas, 8 prahars, one live position. */
export function MandalaClock({
  vedicTime: time,
  now,
  showSanskrit = true,
  selectedIndex = null,
  onSelect,
}: MandalaClockProps) {
  const id = useId().replace(/:/g, "");
  const info = getMuhurtaByIndex(selectedIndex ?? time.absoluteIndex);
  const cycle = time.cycleEnd.getTime() - time.cycleStart.getTime();
  const angle = (date: Date) => 270 + ((date.getTime() - time.cycleStart.getTime()) / cycle) * 360;
  const position = point(173, angle(now));
  const isExploring = selectedIndex !== null;
  return (
    <div className="mandala-instrument">
      <svg
        viewBox="0 0 400 400"
        className="mandala-frame"
        role="group"
        aria-label="Solar clock. Outer ring: 30 muhūrtas. Inner ring: 8 prahars. Tap a segment to explore."
      >
        <defs>
          <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#e0d0ac" />
            <stop offset=".26" stopColor="#fbf7eb" />
            <stop offset=".58" stopColor="#b69a63" />
            <stop offset=".8" stopColor="#f0e5cb" />
            <stop offset="1" stopColor="#aa8d55" />
          </linearGradient>
          <radialGradient id={`${id}-face`} cx="40%" cy="25%" r="80%">
            <stop stopColor="#293c39" />
            <stop offset="1" stopColor="#142622" />
          </radialGradient>
        </defs>
        <circle cx={C} cy={C} r={190} fill={`url(#${id}-metal)`} />
        <circle cx={C} cy={C} r={185.5} fill="#f4f0e6" stroke="#fffdf7" strokeWidth="1" />
        <circle cx={C} cy={C} r={181} fill="#f4f0e6" stroke="#d7cbb3" strokeWidth=".6" />
        {Array.from({ length: 30 }, (_, i) => {
          const index = i + 1;
          const window = getMuhurtaWindow(time, index);
          const start = angle(window.start),
            end = angle(window.end);
          const active = index === time.absoluteIndex;
          const selected = index === selectedIndex;
          const label = point(174, (start + end) / 2);
          const tickStart = point(179, start),
            tickEnd = point(183, start);
          return (
            <g key={index}>
              <line
                x1={tickStart.x}
                y1={tickStart.y}
                x2={tickEnd.x}
                y2={tickEnd.y}
                stroke="#a68b5e"
                strokeWidth=".8"
              />
              <path
                d={arc(160, start + 0.9, end - 0.9)}
                fill="none"
                stroke={active || selected ? "#b68a45" : index <= 15 ? "#d9c6a2" : "#738684"}
                strokeWidth={selected ? 21 : 18}
                className="dial-segment"
              />
              <path
                d={arc(162, start + 0.2, end - 0.2)}
                fill="none"
                stroke="transparent"
                strokeWidth="34"
                tabIndex={0}
                role="button"
                aria-label={`Explore ${getMuhurtaByIndex(index).name}, ${window.period} muhūrta ${window.position} of 15`}
                aria-pressed={selected}
                onClick={() => onSelect?.(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect?.(index);
                  }
                }}
                className="dial-hit"
              />
              {(index === 1 || index % 5 === 0) && (
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="dial-number"
                >
                  {index.toString().padStart(2, "0")}
                </text>
              )}
            </g>
          );
        })}
        <circle cx={C} cy={C} r={139} fill={`url(#${id}-face)`} />
        {Array.from({ length: 8 }, (_, index) => {
          const start = index < 4 ? time.dayStart : time.dayEnd;
          const duration = (index < 4 ? time.dayLength : time.nightLength) / 4;
          const a = new Date(start.getTime() + (index % 4) * duration);
          const b = new Date(a.getTime() + duration);
          const active = now >= a && now < b;
          return (
            <path
              key={index}
              d={arc(133, angle(a) + 2, angle(b) - 2)}
              fill="none"
              stroke={active ? "#e3bf7c" : "#5a6961"}
              strokeWidth={active ? 3 : 1}
              aria-hidden="true"
            />
          );
        })}
        <g aria-hidden="true" className="dial-pointer">
          <circle
            cx={position.x}
            cy={position.y}
            r="5"
            fill="#253d35"
            stroke="#fbf7ec"
            strokeWidth="2"
          />
        </g>
      </svg>
      <div className="dial-centre" aria-hidden="true">
        <span className="dial-kicker">
          {isExploring ? "EXPLORING" : time.period === "day" ? "DAY MUHŪRTA" : "NIGHT MUHŪRTA"}{" "}
          <b>{(((info.index - 1) % 15) + 1).toString().padStart(2, "0")}</b>
        </span>
        {showSanskrit && (
          <span className="dial-sanskrit" lang="sa">
            {info.devanagari}
          </span>
        )}
        <h2 className={info.name.length > 10 ? "dial-name dial-name-long" : "dial-name"}>
          {info.name}
        </h2>
        <span className="dial-meaning">{info.meaning}</span>
        <span className="dial-countdown">
          {isExploring
            ? `${info.index} of 30 muhūrtas`
            : `${formatCountdown(time.currentMuhurtaEnd.getTime() - now.getTime())} remaining`}
        </span>
      </div>
    </div>
  );
}
