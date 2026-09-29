import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { selectionFeedback } from "@/lib/native";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  MapPin,
  Moon,
  Sunrise,
  Sunset,
  Sun,
  Volume2,
} from "lucide-react";
import { MandalaClock } from "@/components/MandalaClock";
import { DetailSheet } from "@/components/samay/DetailSheet";
import { useLocation } from "@/hooks/use-location";
import { usePreferences } from "@/hooks/use-preferences";
import { useSamayTime } from "@/hooks/use-samay-time";
import {
  getMuhurtaWindow,
  getPraharWindow,
  formatTime,
  formatDuration,
  formatCountdown,
} from "@/lib/vedic-time";
import { getMuhurtaByIndex, qualityLabel, DAY_NIGHT_MUHURTAS } from "@/lib/muhurta-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Samay — A different way to be in time" },
      {
        name: "description",
        content:
          "Read the present moment through Indian time. A living solar clock with muhūrta, prahar, ghaṭī, vighaṭī and tithi.",
      },
    ],
  }),
  component: Today,
});

type Sheet = "dial" | "ghati" | "prahar" | "lunar" | null;
function Today() {
  const { location } = useLocation();
  const { preferences } = usePreferences();
  const { now, time, panchanga, lunarError, retryLunar } = useSamayTime(location);
  const [view, setView] = useState<"now" | "day">("now");
  const [selected, setSelected] = useState<number | null>(null);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [speechStatus, setSpeechStatus] = useState("");
  const ready = time?.solarDataAvailable && now;
  const prahar = ready ? getPraharWindow(time, now) : null;
  const info = selected !== null ? getMuhurtaByIndex(selected) : null;
  const window = ready && selected !== null ? getMuhurtaWindow(time, selected) : null;
  const clock = (date: Date) => formatTime(date, time?.timezoneOffset);
  const eventTime = (event: Date) => {
    const offset = (time?.timezoneOffset ?? 0) * 60000;
    const eventDay = new Date(event.getTime() + offset);
    const today = now ? new Date(now.getTime() + offset) : eventDay;
    const suffix =
      eventDay.toISOString().slice(0, 10) !== today.toISOString().slice(0, 10)
        ? `, ${new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(eventDay)}`
        : "";
    return clock(event) + suffix;
  };
  const date =
    now && time
      ? new Intl.DateTimeFormat("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          timeZone: "UTC",
        }).format(new Date(now.getTime() + time.timezoneOffset * 60000))
      : "A new rhythm awaits";
  const current = ready ? getMuhurtaByIndex(time.absoluteIndex) : null;
  const next = ready ? getMuhurtaByIndex(time.absoluteIndex + 1) : null;
  const openMuhurta = (index: number) => {
    void selectionFeedback();
    setSelected(index);
    setSpeechStatus("");
  };
  const pronounce = () => {
    if (!info) return;
    if (!("speechSynthesis" in globalThis)) {
      setSpeechStatus("Pronunciation is unavailable on this device.");
      return;
    }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(info.devanagari ?? info.name);
    utterance.lang = "hi-IN";
    utterance.rate = 0.75;
    utterance.onerror = () => setSpeechStatus("A Hindi voice is unavailable on this device.");
    speechSynthesis.speak(utterance);
  };
  return (
    <main className="today-page">
      <div className="today-heading">
        <div>
          <p className="eyebrow">{date}</p>
          <h1>
            Be in the <em>present.</em>
          </h1>
        </div>
        <Link to="/settings" className="location-link">
          <MapPin size={14} />
          <span>{location.name || "Your location"}</span>
          <ChevronRight size={13} />
        </Link>
      </div>
      <div className="view-switch" role="group" aria-label="Time view">
        <button
          className={view === "now" ? "selected" : ""}
          aria-pressed={view === "now"}
          onClick={() => setView("now")}
        >
          <span className="live-dot" />
          This moment
        </button>
        <button
          className={view === "day" ? "selected" : ""}
          aria-pressed={view === "day"}
          onClick={() => setView("day")}
        >
          The whole day
        </button>
      </div>
      {!time || !now ? (
        <div className="clock-loading" role="status">
          <CircleHelp size={24} />
          <p>Finding your place in the day…</p>
        </div>
      ) : !ready ? (
        <section className="empty-state">
          <Sun size={36} />
          <h2>A day without a solar boundary</h2>
          <p>
            There is no complete sunrise–sunset cycle here today. Choose another location to explore
            the solar clock.
          </p>
          <Link to="/settings" className="primary-button">
            Choose a location <ArrowRight size={16} />
          </Link>
        </section>
      ) : view === "now" ? (
        <div className="moment-layout">
          <section className="timepiece" aria-label="The present moment">
            <div className="instrument-meta">
              <span>
                <i className="live-dot" />
                SŪRYA KĀLA {preferences.showSanskrit && "· सूर्यकाल"}
              </span>
              <button
                className="text-button"
                onClick={() => setSheet("dial")}
                aria-label="How to read the dial"
              >
                <CircleHelp size={15} /> Read the dial
              </button>
            </div>
            <MandalaClock
              vedicTime={time}
              now={now}
              showSanskrit={preferences.showSanskrit}
              onSelect={openMuhurta}
            />
            <p className="sr-only">
              Current muhūrta: {current?.name}.{" "}
              {formatCountdown(time.currentMuhurtaEnd.getTime() - now.getTime())} remaining.
            </p>
            <div className="dial-legend">
              <span>
                <i className="day-dot" />
                15 day
              </span>
              <span>
                <i className="night-dot" />
                15 night
              </span>
              <span>
                <i className="now-dot" /> Now · muhūrta
              </span>
              <span>
                <i className="ghati-hand-key" /> Ghaṭī
              </span>
              <span>
                <i className="vighati-hand-key" /> Vighaṭī
              </span>
            </div>
            {preferences.showModernRange && (
              <p className="modern-time">
                {clock(now)} <span>local time</span>
              </p>
            )}
            <div className="solar-anchors">
              <div>
                <Sunrise size={20} />
                <span>
                  Sunrise<strong>{clock(time.dayStart)}</strong>
                </span>
              </div>
              <span className="solar-anchor-line" />
              <div>
                <Sunset size={20} />
                <span>
                  Sunset<strong>{clock(time.dayEnd)}</strong>
                </span>
              </div>
            </div>
            <button
              className="next-moment"
              onClick={() =>
                time.absoluteIndex === 30 ? setSheet("dial") : openMuhurta(time.absoluteIndex + 1)
              }
            >
              <span>{time.absoluteIndex === 30 ? "DAY RESTARTS" : "UP NEXT"}</span>
              <strong>{time.absoluteIndex === 30 ? "Sunrise" : next?.name}</strong>
              <span>{clock(time.currentMuhurtaEnd)}</span>
              <ArrowRight size={16} />
            </button>
          </section>
          <section className="moment-details" aria-label="Your day in Indian time">
            <div className="section-label">
              <h2>The rhythm of your day</h2>
              <span>अहोरात्र</span>
            </div>
            {preferences.showSubUnits &&
              (preferences.visibleUnits.ghati ||
                preferences.visibleUnits.pala ||
                preferences.visibleUnits.vipala) && (
                <button className="ghati-card" onClick={() => setSheet("ghati")}>
                  <div className="card-topline">
                    <span className="eyebrow">
                      Since sunrise {preferences.showSanskrit && "· सूर्योदयात्"}
                    </span>
                    <ArrowRight size={17} />
                  </div>
                  <div className="traditional-readout">
                    {preferences.visibleUnits.ghati && (
                      <div>
                        <strong>{String(time.ghati).padStart(2, "0")}</strong>
                        <span>
                          Ghaṭī {preferences.showSanskrit && <small lang="sa">घटी</small>}
                        </span>
                      </div>
                    )}
                    {preferences.visibleUnits.ghati && preferences.visibleUnits.pala && <i>:</i>}
                    {preferences.visibleUnits.pala && (
                      <div>
                        <strong>{String(time.pala).padStart(2, "0")}</strong>
                        <span>
                          Vighaṭī {preferences.showSanskrit && <small lang="sa">विघटी</small>}
                        </span>
                      </div>
                    )}
                    {preferences.visibleUnits.vipala && (
                      <div>
                        <strong>{String(time.vipala).padStart(2, "0")}</strong>
                        <span>
                          Vipala {preferences.showSanskrit && <small lang="sa">विपल</small>}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="unit-equivalence">
                    1 ghaṭī = 60 vighaṭīs <span>·</span> 1 vighaṭī = 24 seconds
                  </div>
                </button>
              )}
            <button className="prahar-card" onClick={() => setSheet("prahar")}>
              <div className="prahar-icon">
                {time.period === "day" ? (
                  <Sun size={23} strokeWidth={1.4} />
                ) : (
                  <Moon size={23} strokeWidth={1.4} />
                )}
              </div>
              <div className="prahar-copy">
                <span className="eyebrow">
                  Prahar {preferences.showSanskrit && <span lang="sa">· प्रहर</span>}
                </span>
                <h3>
                  {time.period === "day" ? "Day" : "Night"} · {prahar?.index} of 4
                </h3>
                <span>{prahar ? `${clock(prahar.start)} – ${clock(prahar.end)}` : ""}</span>
              </div>
              <ChevronRight size={17} />
              <div className="prahar-track" aria-hidden="true">
                {[1, 2, 3, 4].map((index) => (
                  <span
                    key={index}
                    className={
                      index === prahar?.index
                        ? "active"
                        : index < (prahar?.index ?? 0)
                          ? "past"
                          : ""
                    }
                  />
                ))}
              </div>
            </button>
            <button className="lunar-card" onClick={() => setSheet("lunar")}>
              <div className="lunar-symbol">
                <Moon size={36} strokeWidth={0.9} />
              </div>
              <div>
                <span className="eyebrow">
                  Tithi {preferences.showSanskrit && <span lang="sa">· तिथि</span>} · lunar day
                </span>
                <h3>
                  {panchanga?.tithi ??
                    (lunarError ? "Lunar data unavailable" : "Reading the lunar sky…")}
                </h3>
                <p>
                  {panchanga?.tithiValidUntil
                    ? `Until ${eventTime(panchanga.tithiValidUntil)}`
                    : "A rhythm of the Sun and Moon"}
                </p>
              </div>
              <ChevronRight size={17} />
            </button>
            {!preferences.simplifiedMode && (
              <Link to="/units" className="learning-nudge">
                <span className="lesson-number">01</span>
                <span>
                  <small>START WITH ONE SMALL SHIFT</small>
                  <strong>What if your day began at sunrise?</strong>
                </span>
                <ArrowRight size={17} />
              </Link>
            )}
          </section>
        </div>
      ) : (
        <section className="day-view">
          <div className="day-intro">
            <div>
              <p className="eyebrow">Sunrise to sunrise</p>
              <h2>One day. Thirty moments.</h2>
            </div>
            <span>
              {clock(time.dayStart)} — {clock(time.cycleEnd)}
            </span>
          </div>
          <p className="body-copy">
            Fifteen muhūrtas of daylight. Fifteen of night. Each expands and contracts with the
            season. Tap a moment to learn its name.
          </p>
          <div className="timeline-halves">
            {["day", "night"].map((half) => (
              <div className="timeline-half" key={half}>
                <h3>
                  {half === "day" ? <Sun size={18} /> : <Moon size={18} />}{" "}
                  {half === "day" ? "Daylight" : "Nightfall"}
                  <span>{formatDuration(half === "day" ? time.dayLength : time.nightLength)}</span>
                </h3>
                {DAY_NIGHT_MUHURTAS.filter((m) =>
                  half === "day" ? m.index <= 15 : m.index > 15,
                ).map((m) => {
                  const range = getMuhurtaWindow(time, m.index);
                  const active = m.index === time.absoluteIndex;
                  return (
                    <button
                      key={m.index}
                      onClick={() => openMuhurta(m.index)}
                      className={`timeline-row ${active ? "current" : ""}`}
                      aria-current={active ? "time" : undefined}
                    >
                      <span className="timeline-index">{String(m.index).padStart(2, "0")}</span>
                      <span className="timeline-name">
                        <strong>
                          {m.name}{" "}
                          {preferences.showSanskrit && <span lang="sa">· {m.devanagari}</span>}
                        </strong>
                        <small>
                          {clock(range.start)} – {clock(range.end)}
                        </small>
                      </span>
                      {active && <span className="now-badge">NOW</span>}
                      <ChevronRight size={15} />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </section>
      )}
      <DetailSheet
        open={selected !== null && !!window}
        onClose={() => {
          setSelected(null);
          if ("speechSynthesis" in globalThis) speechSynthesis.cancel();
        }}
        eyebrow={
          window
            ? `${window.period} muhūrta · मुहूर्त · ${window.position} of 15`
            : "Muhūrta · मुहूर्त"
        }
        title={info?.name ?? ""}
        description={info?.meaning ?? ""}
      >
        {window && info && (
          <>
            {preferences.showSanskrit && (
              <p className="sheet-sanskrit" lang="sa">
                {info.devanagari}
              </p>
            )}
            <div className="sheet-facts">
              <div>
                <small>BEGINS</small>
                <strong>{clock(window.start)}</strong>
              </div>
              <div>
                <small>ENDS</small>
                <strong>{clock(window.end)}</strong>
              </div>
              <div>
                <small>DURATION</small>
                <strong>{formatDuration(window.duration)}</strong>
              </div>
            </div>
            {preferences.showQuality && (
              <div className="tradition-note">
                <p className="eyebrow">Traditional association</p>
                <strong>{qualityLabel(info.quality)}</strong>
                <p>{info.notes}</p>
                <small>Associations vary by tradition; use them as cultural context.</small>
              </div>
            )}
            <button className="secondary-button" onClick={pronounce}>
              <Volume2 size={17} /> Hear the name
            </button>
            <p role="status" className="helper-text">
              {speechStatus}
            </p>
            <div className="sheet-pager">
              <button
                className="icon-button"
                disabled={info.index === 1}
                onClick={() => openMuhurta(info.index - 1)}
                aria-label="Previous muhūrta"
              >
                <ChevronLeft size={20} />
              </button>
              <span>{info.index} / 30</span>
              <button
                className="icon-button"
                disabled={info.index === 30}
                onClick={() => openMuhurta(info.index + 1)}
                aria-label="Next muhūrta"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </>
        )}
      </DetailSheet>
      <DetailSheet
        open={sheet !== null}
        onClose={() => setSheet(null)}
        eyebrow={
          sheet === "lunar" ? "Pañcāṅga · पञ्चाङ्ग · five limbs" : "A field guide to time · काल"
        }
        title={
          sheet === "dial"
            ? "A day, held in a circle."
            : sheet === "ghati"
              ? "Ghaṭī · घटी"
              : sheet === "prahar"
                ? "The chapters of your day."
                : "The sky, in this moment."
        }
        description={
          sheet === "dial"
            ? "Begin at the left edge: sunrise. Follow the circle clockwise through daylight, nightfall and the next sunrise."
            : sheet === "ghati"
              ? "Ghaṭī and vighaṭī (also called pala) measure elapsed time from sunrise in fixed units."
              : sheet === "prahar"
                ? "A prahar is one quarter of the day or night. Four daytime prahars and four nighttime prahars give your day eight natural chapters."
                : "The pañcāṅga brings together five astronomical measures. Tithi follows the angle between the Moon and Sun; it does not change at midnight."
        }
      >
        {sheet === "dial" && (
          <div className="explanation-list">
            <div>
              <span>01</span>
              <p>
                <strong>The outer ring</strong>Thirty segments: fifteen gold for daylight and
                fifteen slate for night. Their widths show their actual duration.
              </p>
            </div>
            <div>
              <span>02</span>
              <p>
                <strong>The inner ring</strong>Eight arcs for the prahars. The lit arc marks your
                current chapter.
              </p>
            </div>
            <div>
              <span>03</span>
              <p>
                <strong>The arrow</strong>Your place in the solar day and active muhūrta. Tap any
                outer segment to see its name and time window.
              </p>
            </div>
            <div>
              <span>04</span>
              <p>
                <strong>The numbered inner scale</strong>Read both hands against 00 at the top, then
                15, 30 and 45 clockwise. Gold counts ghaṭīs from sunrise; pale green sweeps through
                the 60 vighaṭīs within each ghaṭī. This 60-part scale is separate from the outer
                30-muhūrta ring.
              </p>
            </div>
          </div>
        )}
        {sheet === "ghati" && (
          <>
            <div className="conversion-display">
              <span>1 ghaṭī · घटी</span>
              <ArrowRight size={20} />
              <span>60 vighaṭī · विघटी</span>
            </div>
            <p className="body-copy">
              A conventional 24-hour day has 60 ghaṭīs. One ghaṭī is 24 minutes; one vighaṭī (pala)
              is 24 seconds; one vipala is 0.4 seconds. The count starts at local sunrise.
            </p>
            <p className="helper-text">
              The dial uses seasonal muhūrtas. A fixed muhūrta is 48 minutes; a seasonal one is one
              fifteenth of daylight or night. These are distinct conventions.
            </p>
          </>
        )}
        {sheet === "prahar" && ready && prahar && (
          <>
            <div className="conversion-display">
              <span>
                {time.period === "day" ? "Day" : "Night"} prahar {prahar.index}
              </span>
              <span>{Math.round(prahar.progress * 100)}%</span>
            </div>
            <progress
              className="native-progress"
              value={prahar.progress}
              max={1}
              aria-label="Current prahar progress"
            />
            <p className="body-copy">
              This chapter runs from {clock(prahar.start)} to {clock(prahar.end)}. Notice the light
              and pace of your day as each one passes.
            </p>
          </>
        )}
        {sheet === "lunar" && (
          <>
            {lunarError ? (
              <div className="body-copy">
                <p>The lunar calculation could not be completed for this location.</p>
                <button className="secondary-button" onClick={retryLunar}>
                  Try again
                </button>
              </div>
            ) : (
              <dl className="panchanga-list">
                {[
                  ["Tithi", "तिथि", "Lunar day", panchanga?.tithi],
                  ["Vāra", "वार", "Solar weekday", panchanga?.vara],
                  ["Nakṣatra", "नक्षत्र", "Lunar mansion", panchanga?.nakshatra],
                  ["Yoga", "योग", "Sun–Moon longitude sum", panchanga?.yoga],
                  ["Karaṇa", "करण", "Half a tithi", panchanga?.karana],
                ].map(([name, script, meaning, value]) => (
                  <div key={name}>
                    <dt>
                      {name} {preferences.showSanskrit && <span lang="sa">· {script}</span>}
                      <small>{meaning}</small>
                    </dt>
                    <dd>{value ?? "Calculating…"}</dd>
                  </div>
                ))}
              </dl>
            )}
            <p className="helper-text">
              Lahiri ayanāṃśa · Local sunrise boundary. Calculated on your device using Swiss
              Ephemeris with offline fallback.
            </p>
          </>
        )}
        <Link to="/units" className="text-link" onClick={() => setSheet(null)}>
          Explore the time system <ArrowRight size={16} />
        </Link>
      </DetailSheet>
    </main>
  );
}
