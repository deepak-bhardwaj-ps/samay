import { createFileRoute } from "@tanstack/react-router";
import { Clock, Sunrise, BookOpen, Compass } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Muhūrta — Vedic Timekeeping" },
      {
        name: "description",
        content:
          "Learn what a muhūrta is, how Vedic time differs from clock time, and how to use the muhūrta clock in daily life.",
      },
      { property: "og:title", content: "About Muhūrta — Vedic Timekeeping" },
      {
        property: "og:description",
        content: "Learn what a muhūrta is and how Vedic time differs from clock time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-10">
        <div className="text-center">
          <h1 className="font-display text-3xl font-medium tracking-wide text-foreground sm:text-4xl">
            What is Muhūrta?
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            A muhūrta is far more than an ancient unit of time. It is a way of relating to the
            rhythm of the day.
          </p>
        </div>

        <section className="rounded-3xl border border-border/60 bg-card/60 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-ochre" />
            <h2 className="font-display text-2xl text-foreground">Clock time vs. solar time</h2>
          </div>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Modern clocks divide the day into 24 equal hours of 60 minutes each. This is convenient
            but disconnected from the actual light cycle. Vedic timekeeping instead divides the{" "}
            <em>day</em> (sunrise to sunset) and the <em>night</em> (sunset to next sunrise) each
            into 15 muhūrtas — 30 in the full ahorātra. Because the lengths of day and night change
            through the year, a muhūrta is not a fixed 48 minutes — it breathes with the seasons.
          </p>
        </section>

        <section className="rounded-3xl border border-border/60 bg-card/60 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Sunrise className="h-6 w-6 text-gold" />
            <h2 className="font-display text-2xl text-foreground">Why sunrise?</h2>
          </div>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            In the Vedic view, sunrise is the natural beginning of the day. The first muhūrta of the
            day starts at sunrise, and the first muhūrta of the night starts at sunset. This makes
            the clock local: the same modern clock time can fall in a different muhūrta in Stockholm
            than in Singapore.
          </p>
        </section>

        <section className="rounded-3xl border border-border/60 bg-card/60 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-indigo" />
            <h2 className="font-display text-2xl text-foreground">The 30 muhūrtas</h2>
          </div>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Each of the 15 muhūrtas of the day and the 15 of the night carries a name and a quality.
            Some are auspicious for beginnings, some are better for inner work, and some are
            traditionally avoided for major undertakings. The names move in a cycle, so the quality
            of a moment can be read at a glance once you learn the pattern.
          </p>
        </section>

        <section className="rounded-3xl border border-border/60 bg-card/60 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Compass className="h-6 w-6 text-emerald-600" />
            <h2 className="font-display text-2xl text-foreground">Using this in daily life</h2>
          </div>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground">
            <li>Check the current muhūrta before starting an important task or meeting.</li>
            <li>
              Notice how the day feels different when you think in 48-minute solar windows instead
              of hours.
            </li>
            <li>Use the app to learn the names; over time, the rhythm becomes familiar.</li>
            <li>
              Remember that tradition varies by region and lineage — treat this as a living
              reference, not a rigid rulebook.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
