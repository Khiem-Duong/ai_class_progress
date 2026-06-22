# Changelog

## v1.2.0

- Rename "Session Log" to "Date & Time Log".
- Sessions are now always sorted chronologically by date on render,
  regardless of the order they were entered in.
- HOURS field now uses an `H:MM` format (placeholder `-:--`, e.g. `2:15`)
  instead of decimal hours; total hours are parsed and summed as minutes
  and displayed back in `H:MM` (legacy decimal values still parse correctly).
- Topics & Items list now renders newest-first, with item numbers counting
  down from the total (e.g. 4, 3, 2, 1) instead of up from 1.
- Changes are isolated to render/sort/parse logic in `app.js`; the
  `/api/sessions` and `/api/items` Redis-backed endpoints are untouched.

## v1.1.0

- Redesign UI from neobrutalist yellow/black theme to a dark-first, monochrome
  minimalist style (sans-serif typography, subtle borders, soft corner radius),
  inspired by a reference architecture portfolio layout.
- Add numbered section indicators (01 / 02) above each panel heading.
- Add CSS entrance animations for panels and dynamically rendered list/table
  rows, plus smooth hover/active transitions on buttons and the theme toggle.
- Respect `prefers-reduced-motion` to disable animations when requested.
- No changes to `app.js` or the session/items data logic — HTML and CSS only.
