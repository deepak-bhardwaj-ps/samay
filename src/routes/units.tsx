import { createFileRoute } from "@tanstack/react-router";
import {
  VEDIC_UNITS,
  DAY_NIGHT_MUHURTAS,
  qualityColorClass,
  qualityLabel,
} from "@/lib/muhurta-data";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/units")({
  head: () => ({
    meta: [
      { title: "Vedic Time Units Reference" },
      {
        name: "description",
        content:
          "A reference of Vedic time units: muhūrta, ghaṭī, pala, vipala, and the 30 named muhūrtas — 15 of day and 15 of night.",
      },
      { property: "og:title", content: "Vedic Time Units Reference" },
      {
        property: "og:description",
        content: "Reference of Vedic time units and the 30 named muhūrtas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UnitsPage,
});

function UnitsPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="text-center">
          <h1 className="font-display text-3xl font-medium tracking-wide text-foreground sm:text-4xl">
            Vedic Time Units
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            From the largest cycle to the smallest practical division.
          </p>
        </div>

        <section>
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl text-foreground">
            <Clock className="h-6 w-6 text-ochre" />
            The units
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {VEDIC_UNITS.map((unit) => (
              <div
                key={unit.id}
                className="rounded-2xl border border-border/60 bg-card/60 p-5 transition-colors hover:border-gold/40"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl text-foreground">{unit.name}</h3>
                  {unit.devanagari && <span className="text-lg text-gold">{unit.devanagari}</span>}
                </div>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  ≈ {unit.modernEquivalent}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {unit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-2xl text-foreground">The 30 muhūrtas</h2>
          <p className="mb-6 text-muted-foreground">
            These names repeat for both day and night. The qualities are traditional guidelines, not
            absolute rules.
          </p>
          <div className="overflow-hidden rounded-2xl border border-border/60">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/70 text-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Meaning</th>
                  <th className="px-4 py-3 font-medium">Quality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {DAY_NIGHT_MUHURTAS.map((m) => (
                  <tr key={m.index} className="bg-card/40 hover:bg-secondary/30">
                    <td className="px-4 py-3 text-muted-foreground">{m.index}</td>
                    <td className="px-4 py-3 font-display text-base text-foreground">
                      {m.devanagari && <span className="mr-2 text-gold">{m.devanagari}</span>}
                      {m.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{m.meaning}</td>
                    <td className={`px-4 py-3 font-medium ${qualityColorClass(m.quality)}`}>
                      {qualityLabel(m.quality)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
