import { createFileRoute } from "@tanstack/react-router";
import { useId, useState, type FormEvent } from "react";
import { Check, LocateFixed, MapPin, RotateCcw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "@/hooks/use-location";
import { usePreferences } from "@/hooks/use-preferences";
import type { GeoLocation } from "@/lib/vedic-time";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Samay" }] }),
  component: SettingsPage,
});
const PLACES: GeoLocation[] = [
  { name: "New Delhi", latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata" },
  { name: "Varanasi", latitude: 25.3176, longitude: 82.9739, timezone: "Asia/Kolkata" },
  { name: "Ujjain", latitude: 23.1765, longitude: 75.7885, timezone: "Asia/Kolkata" },
  { name: "Mumbai", latitude: 19.076, longitude: 72.8777, timezone: "Asia/Kolkata" },
  { name: "Sydney", latitude: -33.8688, longitude: 151.2093, timezone: "Australia/Sydney" },
  { name: "London", latitude: 51.5072, longitude: -0.1276, timezone: "Europe/London" },
];
function SettingsPage() {
  const { location, setLocation, detectLocation, isDetecting, error } = useLocation();
  const { preferences, setPreferences, setVisibleUnit, resetPreferences } = usePreferences();
  const [saved, setSaved] = useState("");
  return (
    <main className="content-page">
      <div className="page-intro">
        <p className="eyebrow">Make time your own</p>
        <h1>
          Your place.
          <br />
          Your rhythm.
        </h1>
        <p>
          The Sun keeps a different clock in every place. Set yours, then choose how much detail you
          want to see.
        </p>
      </div>
      <section className="settings-section">
        <h2>Where you are</h2>
        <p>Your location sets the solar day. Choose a city or use your device location.</p>
        <p className="current-place">
          <MapPin size={16} />
          {location.name || "Custom location"}
        </p>
        <div className="place-grid">
          {PLACES.map((place) => (
            <button
              key={place.name}
              className={`place-option ${location.latitude === place.latitude && location.longitude === place.longitude ? "active" : ""}`}
              aria-pressed={
                location.latitude === place.latitude && location.longitude === place.longitude
              }
              onClick={() => {
                setLocation(place);
                setSaved(`Clock set to ${place.name}.`);
              }}
            >
              {place.name}
              <small>
                {place.timezone === "Asia/Kolkata"
                  ? "India · IST"
                  : place.timezone?.replace("/", " · ")}
              </small>
            </button>
          ))}
        </div>
        <button
          className="secondary-button"
          onClick={() => {
            setSaved("");
            detectLocation();
          }}
          disabled={isDetecting}
        >
          <LocateFixed size={16} />
          {isDetecting ? "Finding your location…" : "Use my current location"}
        </button>
        {error && (
          <p role="alert" className="feedback error">
            {error}
          </p>
        )}
        <p className="helper-text">
          Location is used on this device to calculate solar times. You can use a city without
          sharing your device location.
        </p>
        <details className="settings-disclosure">
          <summary>Set a custom location</summary>
          <LocationForm
            key={JSON.stringify(location)}
            location={location}
            onSave={(value) => {
              setLocation(value);
              setSaved("Custom location saved.");
            }}
          />
        </details>
        <p role="status" className="feedback">
          {saved}
        </p>
      </section>
      <section className="settings-section">
        <h2>Reading the clock</h2>
        <Preference
          label="Sanskrit names"
          description="Show Devanagari alongside the current muhūrta name."
          checked={preferences.showSanskrit}
          onChange={(value) => setPreferences({ showSanskrit: value })}
        />
        <Preference
          label="Modern clock time"
          description="Keep familiar local time beneath the solar dial."
          checked={preferences.showModernRange}
          onChange={(value) => setPreferences({ showModernRange: value })}
        />
        <Preference
          label="Traditional associations"
          description="Include cultural qualities in muhūrta details."
          checked={preferences.showQuality}
          onChange={(value) => setPreferences({ showQuality: value })}
        />
        <Preference
          label="Ghaṭī and vighaṭī readout"
          description="See fixed units counting from sunrise."
          checked={preferences.showSubUnits}
          onChange={(value) => setPreferences({ showSubUnits: value })}
        />
        <Preference
          label="A quieter view"
          description="Hide learning prompts on the Today screen."
          checked={preferences.simplifiedMode}
          onChange={(value) => setPreferences({ simplifiedMode: value })}
        />
        {preferences.showSubUnits && (
          <div className="unit-toggles">
            {(
              [
                ["ghati", "Ghaṭī"],
                ["pala", "Vighaṭī / pala"],
                ["vipala", "Vipala"],
              ] as const
            ).map(([key, label]) => (
              <label className="unit-toggle" key={key}>
                <input
                  type="checkbox"
                  checked={preferences.visibleUnits[key]}
                  onChange={(event) => setVisibleUnit(key, event.target.checked)}
                />
                {label}
              </label>
            ))}
          </div>
        )}
      </section>
      <button
        className="text-button"
        onClick={() => {
          resetPreferences();
          setSaved("Display preferences restored.");
        }}
      >
        <RotateCcw size={14} /> Reset display preferences
      </button>
      <section className="app-note">
        <strong>Try Samay on your iPhone</strong>
        <p>
          Open the app in Safari. Use Share → Add to Home Screen for a dedicated, full-screen
          experience. The app remembers your place and preferences on this device.
        </p>
      </section>
    </main>
  );
}
function Preference({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="preference-row">
      <div>
        <label htmlFor={id}>{label}</label>
        <p>{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
function LocationForm({
  location,
  onSave,
}: {
  location: GeoLocation;
  onSave: (value: GeoLocation) => void;
}) {
  const [name, setName] = useState(location.name ?? "");
  const [latitude, setLatitude] = useState(String(location.latitude));
  const [longitude, setLongitude] = useState(String(location.longitude));
  const [timezone, setTimezone] = useState(location.timezone ?? "Asia/Kolkata");
  const [error, setError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    const lat = Number(latitude),
      lng = Number(longitude);
    if (
      !latitude.trim() ||
      !longitude.trim() ||
      !Number.isFinite(lat) ||
      Math.abs(lat) > 90 ||
      !Number.isFinite(lng) ||
      Math.abs(lng) > 180
    ) {
      setError("Enter a latitude from −90 to 90 and a longitude from −180 to 180.");
      return;
    }
    try {
      new Intl.DateTimeFormat("en", { timeZone: timezone.trim() }).format();
    } catch {
      setError("Enter a valid timezone, such as Asia/Kolkata or Australia/Sydney.");
      return;
    }
    onSave({
      latitude: lat,
      longitude: lng,
      name: name.trim() || "Custom location",
      timezone: timezone.trim(),
    });
    setError("");
  }
  return (
    <form className="settings-form" onSubmit={submit}>
      <label className="form-wide">
        Place name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
          placeholder="Your place"
        />
      </label>
      <label>
        Latitude
        <input
          type="number"
          min="-90"
          max="90"
          step="any"
          required
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
      </label>
      <label>
        Longitude
        <input
          type="number"
          min="-180"
          max="180"
          step="any"
          required
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
      </label>
      <label className="form-wide">
        Timezone
        <input
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          required
          list="timezones"
          placeholder="Australia/Sydney"
          autoComplete="off"
        />
        <datalist id="timezones">
          {[
            "Asia/Kolkata",
            "Australia/Sydney",
            "Europe/London",
            "America/New_York",
            "America/Los_Angeles",
            "Asia/Singapore",
            "Asia/Dubai",
          ].map((value) => (
            <option key={value} value={value} />
          ))}
        </datalist>
      </label>
      <p className="helper-text form-wide">
        Use a named timezone so daylight-saving changes are handled automatically.
      </p>
      <div className="field-actions form-wide">
        <button type="submit" className="primary-button">
          <Check size={16} /> Save location
        </button>
      </div>
      {error && (
        <p className="feedback error form-wide" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
