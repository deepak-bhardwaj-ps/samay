import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "@/hooks/use-location";
import { usePreferences } from "@/hooks/use-preferences";
import { longitudeToTimezoneOffset, formatTimezoneOffset } from "@/lib/vedic-time";
import { MapPin, RotateCcw, LocateFixed } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Muhūrta Clock" },
      {
        name: "description",
        content: "Set your location and customize how the Muhūrta Clock displays Vedic time.",
      },
      { property: "og:title", content: "Settings — Muhūrta Clock" },
      {
        property: "og:description",
        content: "Set your location and customize how the Muhūrta Clock displays Vedic time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { location, setLocation, detectLocation, isDetecting, error } = useLocation();
  const { preferences, setPreferences, setVisibleUnit, resetPreferences } = usePreferences();

  const [lat, setLat] = useState(location.latitude.toString());
  const [lng, setLng] = useState(location.longitude.toString());
  const [name, setName] = useState(location.name ?? "");
  const [offset, setOffset] = useState(
    location.timezoneOffset?.toString() ?? longitudeToTimezoneOffset(location.longitude).toString(),
  );

  const suggestedOffset = useMemo(() => longitudeToTimezoneOffset(parseFloat(lng) || 0), [lng]);

  const handleSaveLocation = () => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const timezoneOffset = parseFloat(offset);
    if (!Number.isNaN(latitude) && !Number.isNaN(longitude) && !Number.isNaN(timezoneOffset)) {
      const trimmedName = name.trim();
      setLocation({ latitude, longitude, name: trimmedName || undefined, timezoneOffset });
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="font-display text-3xl font-medium tracking-wide text-foreground sm:text-4xl">
            Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Choose your location and how you want to read the clock.
          </p>
        </div>

        <section className="rounded-3xl border border-border/60 bg-card/60 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-ochre" />
            <h2 className="font-display text-xl text-foreground">Location</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Sunrise and sunset are calculated from these coordinates. The clock works anywhere on
            Earth.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="e.g. 28.61"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="e.g. 77.21"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="location-name">Location name (optional)</Label>
              <Input
                id="location-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. New Delhi"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="timezone-offset">Timezone offset from UTC (minutes)</Label>
                <span className="text-xs text-muted-foreground">
                  Solar estimate: {formatTimezoneOffset(suggestedOffset)}
                </span>
              </div>
              <Input
                id="timezone-offset"
                type="number"
                step="15"
                value={offset}
                onChange={(e) => setOffset(e.target.value)}
                placeholder="e.g. 330 for IST (+5:30)"
              />
              <p className="text-xs text-muted-foreground">
                Positive = east of UTC. Adjust this to your location&apos;s actual timezone so
                sunrise/sunset display in local clock time.
              </p>
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              onClick={handleSaveLocation}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save location
            </Button>
            <Button
              variant="outline"
              onClick={detectLocation}
              disabled={isDetecting}
              className="gap-2"
            >
              <LocateFixed className="h-4 w-4" />
              {isDetecting ? "Detecting…" : "Detect my location"}
            </Button>
          </div>
        </section>

        <section className="rounded-3xl border border-border/60 bg-card/60 p-6 sm:p-8">
          <h2 className="font-display text-xl text-foreground">Display options</h2>
          <div className="mt-5 space-y-4">
            <PreferenceSwitch
              label="Show Sanskrit names"
              description="Display Devanagari script alongside transliterations."
              checked={preferences.showSanskrit}
              onCheckedChange={(v) => setPreferences({ showSanskrit: v })}
            />
            <PreferenceSwitch
              label="Show modern time range"
              description="Display when the current muhūrta starts and ends in clock time."
              checked={preferences.showModernRange}
              onCheckedChange={(v) => setPreferences({ showModernRange: v })}
            />
            <PreferenceSwitch
              label="Show quality indicators"
              description="Show whether a muhūrta is traditionally auspicious, neutral, or inauspicious."
              checked={preferences.showQuality}
              onCheckedChange={(v) => setPreferences({ showQuality: v })}
            />
            <PreferenceSwitch
              label="Show sub-units"
              description="Display ghaṭī, pala, and vipala readouts."
              checked={preferences.showSubUnits}
              onCheckedChange={(v) => setPreferences({ showSubUnits: v })}
            />
          </div>
        </section>

        {preferences.showSubUnits && (
          <section className="rounded-3xl border border-border/60 bg-card/60 p-6 sm:p-8">
            <h2 className="font-display text-xl text-foreground">Visible sub-units</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <UnitToggle
                label="Muhūrta"
                checked={preferences.visibleUnits.muhurta}
                onCheckedChange={(v) => setVisibleUnit("muhurta", v)}
              />
              <UnitToggle
                label="Ghaṭī"
                checked={preferences.visibleUnits.ghati}
                onCheckedChange={(v) => setVisibleUnit("ghati", v)}
              />
              <UnitToggle
                label="Pala"
                checked={preferences.visibleUnits.pala}
                onCheckedChange={(v) => setVisibleUnit("pala", v)}
              />
              <UnitToggle
                label="Vipala"
                checked={preferences.visibleUnits.vipala}
                onCheckedChange={(v) => setVisibleUnit("vipala", v)}
              />
            </div>
          </section>
        )}

        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={resetPreferences}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
            Reset all preferences
          </Button>
        </div>
      </div>
    </main>
  );
}

function PreferenceSwitch({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function UnitToggle({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-3">
      <span className="font-medium text-foreground">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
