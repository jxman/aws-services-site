# Google Analytics (GA4) — Review & Recommendations

GA4 property `G-2HLT4VSZHW`, loaded via `gtag.js`. Pageviews are tracked on
every route change via `usePageTracking` (`src/hooks/usePageTracking.js`),
wired in `App.jsx`. Custom event helpers live in `src/utils/analytics.js`.

---

## ✅ Implemented — 2026-09-05

### 1. Duplicate pageview on initial load

**Issue**: `index.html` called `gtag("config", ...)` on script load, which
auto-fires a pageview. `usePageTracking`'s effect then fired again on mount
(route "changes" from nothing to `/`), calling `trackPageView` → a second
`gtag('config', ...)`. Every landing page was double-counted.

**Fix**: `initGA()` (`src/utils/analytics.js`) now sets
`{ send_page_view: false }` on the config call, and `usePageTracking` owns
every pageview, including the first.

**Status**: ✅ IMPLEMENTED

---

### 2. GA loading during local dev / testing

**Issue**: No dev/prod guard existed. Every `npm run dev` session and every
port-3002 test run (required before handing off changes, per project
workflow) sent real pageviews/events to the live production GA property,
polluting analytics data with non-user traffic.

**Fix**: `initGA()` only injects the gtag.js script and initializes
`window.gtag` when `import.meta.env.PROD` is true. `trackPageView` and
`trackEvent` already no-op when `window.gtag` is undefined, so dev/test runs
are now silent by construction — verified by curling a `vite --port 3002`
dev server and confirming no `gtag` script tag is served.

**Status**: ✅ IMPLEMENTED

---

### 3. Measurement ID duplicated in two places

**Issue**: `G-2HLT4VSZHW` was hardcoded independently in `index.html` and
`src/utils/analytics.js` — a drift risk if the ID ever changes.

**Fix**: Single source of truth via `VITE_GA_MEASUREMENT_ID` env var
(`.env.example`, copy to `.env` locally), read once in `analytics.js` with a
fallback to the current production ID so a missing `.env` never breaks the
build. The static `index.html` snippet was removed entirely — GA now
initializes from `src/main.jsx` via `initGA()`.

**Status**: ✅ IMPLEMENTED

---

### 4. Non-standard GA4 pageview pattern

**Issue**: Route-change tracking re-invoked `gtag('config', ...)` on every
navigation. GA4's current guidance is to send an explicit `page_view` event
(not re-run `config`) for subsequent navigations, and to include
`page_location` alongside `page_path`/`page_title`.

**Fix**: `trackPageView` now sends:
```js
window.gtag('event', 'page_view', {
  page_path: url,
  page_title: title,
  page_location: window.location.href,
});
```

**Status**: ✅ IMPLEMENTED

---

## 🔧 Suggested Improvements (Not Yet Implemented)

### 5. `trackEvent` / `trackInteraction` are unused

**Issue**: Custom event helpers exist but are never called — the site only
ever records pageviews today, with zero engagement/feature-usage data.

**Candidates**:
- `Reports.jsx` export actions — `exportRegionsCSV`, `exportServicesCSV`,
  `exportCoverageCSV`, and the Excel report download link. No visibility
  today into which export format people actually use.
- Search usage across Regions/Services/Coverage/WhatsNew — a GA4 `search`
  event with a `search_term` param would surface what people look for.
- Outbound clicks: "Buy me a coffee" and Synepho links in `Footer.jsx`.
- Service/Region detail modal opens (`ServiceDetailModal.jsx`,
  `RegionDetailModal.jsx`).

**Status**: ⬜ NOT STARTED — ⚠️ MEDIUM PRIORITY

---

### 6. Verify GA4 Enhanced Measurement is enabled

**Issue**: GA4's Enhanced Measurement (admin console setting, not code) auto-
tracks outbound clicks, file downloads, and scroll depth for free. Not
confirmed whether it's on for this property — if it is, part of #5 may
already be covered without any code change.

**Status**: ⬜ NOT STARTED (needs GA admin console check, not a code change) — LOW PRIORITY

---

### 7. No cookie-consent banner

**Issue**: GA4 anonymizes IP by default and this is a low-risk informational
dashboard, so likely acceptable as-is, but there's no conscious compliance
decision on record for EU/GDPR-region traffic.

**Status**: ⬜ NOT STARTED — LOW PRIORITY, revisit if EU traffic/compliance becomes a concern
