# Vedic Muhūrta Clock — Build Plan

## Goal
Build a web app that translates modern clock time into authentic Vedic time units based on the user's local sunrise and sunset. The app should make the system visually intuitive for beginners while remaining faithful enough for daily lifestyle use.

## What we know
- Time basis: sunrise/sunset, not a fixed 24-hour window.
- Units: all major Vedic units, configurable display (muhūrta, ghaṭī/ghaṭikā, pala, vipala; optionally tithi, nakṣatra, yoga, karaṇa, rāhu kāla).
- Audience: anyone curious to learn or apply the concept in daily life.
- Visual direction: Indian Sanskrit + mandala style, traditional yet comprehensible.

## Core features

1. **Location-aware astronomical clock**
   - Detect or let the user set latitude/longitude.
   - Calculate local sunrise and sunset for the current day.
   - Divide the day (sunrise → sunset) and night (sunset → sunrise) each into 30 muhūrtas.
   - Convert current time into Vedic units in real time.

2. **Mandala clock visualization**
   - Circular day/night mandala with the current muhūrta highlighted.
   - Sanskrit labels transliterated alongside English (e.g., *Rudra*, *Ahi*, *Mitra*).
   - Smooth indicator that moves as the Vedic moments pass.

3. **Educational reference**
   - `/about` or `/learn` pages explaining each unit and the 30 muhūrtas of the day/night.
   - Short, practical descriptions so users can connect names to daily life.

4. **User preferences**
   - Save location and selected visible units.
   - Toggle between strict sunrise/sunset mode and a simplified fixed mode for learning.

## Technical approach

- **Framework**: existing TanStack Start project.
- **Backend / persistence**: enable Lovable Cloud to store user preferences (location, selected units, simplified mode).
- **Astronomy**: use a lightweight sunrise/sunset library (e.g., `suncalc3`) or port the necessary algorithms; keep all calculations client-side where possible so the clock updates smoothly.
- **Styling**: extend `src/styles.css` with a warm, traditional palette — deep ochre, sand, gold, indigo — and register semantic tokens. Use circular SVG/Canvas for the mandala clock.
- **Routes**:
  - `/` — main muhūrta clock
  - `/about` — what is muhūrta and how to read the clock
  - `/units` — reference for all Vedic units
  - `/settings` — location, unit toggles, display mode

## Build phases

1. **Foundation**
   - Enable Lovable Cloud.
   - Define design tokens and load a traditional font pair (e.g., a serif/Sanskrit-feel display + clean body).
   - Set up routes and shared layout with header/footer navigation.

2. **Time engine**
   - Implement sunrise/sunset calculation from lat/long and date.
   - Implement Vedic conversion: muhūrta, ghaṭikā, pala, vipala.
   - Add optional tithi/nakṣatra/yoga/karaṇa calculations if scope allows.

3. **Clock UI**
   - Build the mandala-style circular clock with current-moment indicator.
   - Show digital readout of current Vedic time and the modern time range of the active muhūrta.
   - Add a "now" pulse and hover tooltips for each segment.

4. **Education & settings**
   - Write the `/about` and `/units` pages.
   - Build `/settings` with location search, unit toggles, and simplified-mode switch.
   - Persist preferences via Lovable Cloud.

5. **Polish & launch**
   - Add responsive behavior and dark-mode support.
   - Add SEO meta for each route.
   - Test across locations and edge cases (polar regions, DST transitions).

## Open decisions for you

- Should the app auto-detect location on first visit, or ask the user to enter a city?
- Do you want nakṣatra/tithi/yoga included in the first version, or kept for a later phase?
- Should the clock show the 30 named muhūrtas (e.g., Prātaḥ, Saṃdhyā) or just the numeric Vedic time?

## First milestone
A working `/` page that shows the current local sunrise/sunset and a live muhūrta readout in a mandala-style clock, plus a `/settings` page to set location and choose visible units.
