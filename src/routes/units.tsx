import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Plus, Sunrise } from "lucide-react";
export const Route = createFileRoute("/units")({
  head: () => ({ meta: [{ title: "Learn Indian time — Samay" }] }),
  component: LearnPage,
});
const LESSONS = [
  {
    name: "Ahorātra",
    script: "अहोरात्र",
    measure: "One sunrise to the next",
    text: "One full cycle of day and night. Samay anchors the cycle at local sunrise, so your daily count begins with the light. Its length is close to 24 hours, with small seasonal changes.",
  },
  {
    name: "Prahar",
    script: "प्रहर",
    measure: "A quarter of daylight or night",
    text: "Eight chapters make a day: four between sunrise and sunset, then four until the next sunrise. In this app, prahars stretch with each solar half. Use them to notice the broad rhythm of morning, midday, evening and night.",
  },
  {
    name: "Muhūrta",
    script: "मुहूर्त",
    measure: "15 in the day · 15 in the night",
    text: "The clock uses seasonal muhūrtas: each is one fifteenth of daylight or night. Their duration changes through the year. The fixed traditional unit called a muhūrta is 48 minutes, or two ghaṭīs; it is a different convention.",
  },
  {
    name: "Ghaṭī",
    script: "घटी",
    measure: "24 minutes · 60 pal",
    text: "A fixed unit traditionally associated with water clocks. The large ghaṭī count on Today measures elapsed time from the active sunrise. It is independent of the seasonal muhūrta dial.",
  },
  {
    name: "Pal",
    script: "पल",
    measure: "24 seconds · 60 vipal",
    text: "Also called pala. Sixty pal make one ghaṭī. A pal advances every 24 seconds: a small, perceptible unit that gives familiar minutes a different rhythm. One vipal is 0.4 seconds.",
  },
  {
    name: "Tithi",
    script: "तिथि",
    measure: "12° of Sun–Moon separation",
    text: "A lunar day ends when the angular separation of the Moon and Sun crosses another 12-degree boundary. There are 30 tithis in a lunar month. Śukla is the waxing fortnight; Kṛṣṇa is the waning fortnight. A tithi can end at any time of the day.",
  },
];
function LearnPage() {
  const [minutes, setMinutes] = useState(48);
  const ghati = Math.floor(minutes / 24);
  const pal = Math.round((minutes % 24) * 2.5);
  return (
    <main className="content-page">
      <div className="page-intro">
        <p className="eyebrow">A field guide to Indian time</p>
        <h1>
          Less counting.
          <br />
          More noticing.
        </h1>
        <p>
          You already know the rhythm of light and dark. Indian time gives that rhythm a language.
        </p>
      </div>
      <section className="lesson-hero">
        <Sunrise size={37} strokeWidth={1.1} />
        <p className="eyebrow">Your first small shift</p>
        <h2>
          Let your day
          <br />
          begin with the Sun.
        </h2>
        <p>
          Tomorrow morning, check the ghaṭī count after sunrise. Read it alongside your usual clock.
          One familiar moment, seen in a different way.
        </p>
      </section>
      <div className="section-label">
        <h2>Six ideas to start with</h2>
        <span>Tap to explore</span>
      </div>
      <div className="lesson-grid">
        {LESSONS.map((lesson, index) => (
          <details className="lesson-card" key={lesson.name}>
            <summary>
              <div className="lesson-topline">
                <span>LESSON {String(index + 1).padStart(2, "0")}</span>
                <Plus size={15} />
              </div>
              <h2>
                {lesson.name}
                <span lang="sa">{lesson.script}</span>
              </h2>
              <p>{lesson.measure}</p>
            </summary>
            <p>{lesson.text}</p>
          </details>
        ))}
      </div>
      <section className="converter">
        <p className="eyebrow">Make it familiar</p>
        <h2>A little translation.</h2>
        <label htmlFor="minute-converter" className="helper-text">
          Move the slider to turn minutes into ghaṭī and pal.
        </label>
        <div className="converter-control">
          <input
            id="minute-converter"
            type="range"
            min="0"
            max="240"
            step="2"
            value={minutes}
            onChange={(event) => setMinutes(Number(event.target.value))}
          />
          <output htmlFor="minute-converter">{minutes} minutes</output>
        </div>
        <p className="converter-result" aria-live="polite">
          {ghati} ghaṭī <span className="text-muted-foreground">·</span> {pal} pal
        </p>
      </section>
      <Link to="/about" className="text-link">
        The thinking behind Samay <ArrowRight size={16} />
      </Link>
      <p className="app-note">
        Samay distinguishes fixed time units from seasonal solar divisions. Regional names and
        conventions vary. <Link to="/about">Read about our conventions.</Link>
      </p>
    </main>
  );
}
