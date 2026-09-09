import type { VedicTime } from "@/lib/vedic-time";
import { formatTime, formatDuration, getMuhurtaWindow } from "@/lib/vedic-time";
import { getMuhurtaByIndex, qualityLabel } from "@/lib/muhurta-data";
import type { DisplayPreferences } from "@/hooks/use-preferences";
import { Volume2 } from "lucide-react";

interface TimeReadoutProps {
  vedicTime: VedicTime;
  preferences: DisplayPreferences;
  selectedIndex?: number | null;
}

export function TimeReadout({ vedicTime, preferences, selectedIndex = null }: TimeReadoutProps) {
  if (!vedicTime.solarDataAvailable) {
    return (
      <div
        className="mx-auto w-full max-w-xl rounded-3xl border border-border/60 bg-card/70 p-4 text-center shadow-sm backdrop-blur-sm sm:p-6"
        role="status"
      >
        Muhūrta timing is unavailable until sunrise and sunset can be calculated for this location.
      </div>
    );
  }

  const isExploring = selectedIndex !== null;
  const muhurtaInfo = getMuhurtaByIndex(selectedIndex ?? vedicTime.absoluteIndex);
  const selectedWindow = getMuhurtaWindow(vedicTime, selectedIndex ?? vedicTime.absoluteIndex);

  return (
    <div className="mx-auto w-full max-w-xl space-y-5 rounded-3xl border border-border/60 bg-card/70 p-4 shadow-sm backdrop-blur-sm sm:p-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-xl text-foreground">
            {muhurtaInfo.name}
            {preferences.showSanskrit && muhurtaInfo.devanagari ? (
              <span className="ml-2 text-gold">{muhurtaInfo.devanagari}</span>
            ) : null}
          </h3>
          {preferences.showQuality && (
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              {qualityLabel(muhurtaInfo.quality)}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{muhurtaInfo.meaning}</p>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{pronunciation(muhurtaInfo.name)}</span>
          <button
            type="button"
            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border border-border/60 text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-day"
            aria-label={`Play pronunciation for ${muhurtaInfo.name}`}
            onClick={() => {
              if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(new SpeechSynthesisUtterance(muhurtaInfo.name));
              }
            }}
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {preferences.showModernRange && (
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-secondary/60 p-3 text-center">
          <Cell
            label="Starts"
            value={formatTime(
              isExploring ? selectedWindow.start : vedicTime.currentMuhurtaStart,
              vedicTime.timezoneOffset,
            )}
          />
          <Cell
            label="Ends"
            value={formatTime(
              isExploring ? selectedWindow.end : vedicTime.currentMuhurtaEnd,
              vedicTime.timezoneOffset,
            )}
          />
          <Cell
            label="Length"
            value={formatDuration(isExploring ? selectedWindow.duration : vedicTime.muhurtaLength)}
          />
        </div>
      )}

      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {selectedWindow.period === "day" ? "Day" : "Night"} Muhūrta {selectedWindow.position} of 15
      </p>
    </div>
  );
}

function pronunciation(name: string): string {
  const known: Record<string, string> = {
    Vasu: "va-su",
    Rudra: "ru-dra",
    Mitra: "mi-tra",
    Āhi: "aa-hi",
    Vāruṇa: "vaa-ru-na",
    Vāyu: "vaa-yu",
    Savitṛ: "sa-vi-tri",
  };
  return known[name] ?? name.toLowerCase();
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
