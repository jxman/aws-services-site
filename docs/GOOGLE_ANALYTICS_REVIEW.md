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
ever recorded pageviews, with zero engagement/feature-usage data.

**Fix**: Wired up three custom events across all export/link surfaces,
using custom event names (not GA4's reserved `file_download`) to avoid any
ambiguity with Enhanced Measurement's automatic detection — the CSV exports
use `blob:` URLs Enhanced Measurement can't see anyway, so this is the only
way to capture them.

- **`file_export`** (`file_type`, `report_name`, `source`) — fired from all
  8 export functions: `Regions.jsx`/`Services.jsx`/`Coverage.jsx` page-level
  `exportToCSV`, `Reports.jsx`'s three `export*CSV` functions, the two
  detail-modal `exportToCSV` functions (`RegionDetailModal.jsx`,
  `ServiceDetailModal.jsx`), and both Excel report download links
  (`Reports.jsx`, `Footer.jsx`).
- **`outbound_click`** (`link_url`, `link_text`) — Buy Me a Coffee, Synepho,
  "AWS Infrastructure Fetcher", and "Data Contract" links in `Footer.jsx`.
- **`view_item_detail`** (`item_type`, `item_code`) — fired from
  `handleRegionClick`/`handleServiceClick` in `Regions.jsx`/`Services.jsx`
  when a detail modal is opened.

Search-term tracking was scoped out: the search inputs fire `onChange` per
keystroke, so tracking it properly needs a debounce hook, deferred as a
separate follow-up rather than bundled into this pass.

**Update (same day, after auditing the live GA4 account — see #9)**:
removed the `file_export` calls on the two static Excel `.xlsx` download
links (`Reports.jsx`, `Footer.jsx`) and all 5 `outbound_click` calls in
`Footer.jsx` — GA4 Enhanced Measurement was found to already be on for this
property and auto-tracks both `file_download` (real anchor `href`s with a
recognized extension) and outbound `click` events, making that subset of
our custom instrumentation a duplicate. The CSV `file_export` calls stay,
since those use `blob:` URLs Enhanced Measurement can't see, and
`view_item_detail` stays as the only way to capture modal-open engagement.

**Status**: ✅ IMPLEMENTED (search-term tracking deferred, see below)

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

---

### 8. Search-term tracking (deferred from #5)

**Issue**: Search inputs on Regions/Services/Coverage fire `onChange` per
keystroke — tracking raw would send a GA event per character typed.

**Fix (planned)**: Add a small `useDebouncedValue` hook and fire a GA4
`search` event (`search_term`, `page`) ~600-800ms after the user stops
typing, or on blur.

**Status**: ⬜ NOT STARTED — LOW/MEDIUM PRIORITY

---

## Live GA4 Account Audit — 2026-09-05

Reviewed the actual GA4 property backing `G-2HLT4VSZHW` via the Analytics
console (account "Synepho Sites", property `synepho.com` / 302736060,
stream `synepho` / 3234304275). Key finding: this one stream/property
receives data from every `*.synepho.com` site (and possibly others) that
uses this measurement ID — GA4 doesn't scope collection by domain, it pools
by measurement ID. That's expected/by design here, not a bug, but explains
why `aws-services.synepho.com` traffic shows up alongside other sites' data
with no built-in separation (a `hostname` dimension is captured on every hit
if per-site breakdown is ever needed).

### 9. Enhanced Measurement is already on

**Finding**: Page views, Scrolls, Outbound clicks, Site search, Video
engagement, and File downloads are all enabled (Form interactions is off).
Acted on above (#5 update): removed the redundant custom `file_export` /
`outbound_click` calls for real anchor-tag links, since GA4 already emits
equivalent automatic events for those. Confirmed Site search's automatic
detection is URL-query-param based, which doesn't apply to this app's
client-side search state — so #8 (deferred debounced search tracking)
remains genuinely necessary, not redundant.

**Status**: ✅ NOTED, acted on

---

### 10. Internal Traffic filter is in "Testing" state, not "Active"

**Issue**: An "Internal Traffic" data filter exists (excludes events where
`traffic_type` = `internal`), but its state is **Testing** — in this state
GA4 only tags matching traffic for verification, it does **not** exclude it
from reports. If this was meant to keep the property owner's own visits out
of the numbers, it isn't doing that yet.

**Next step**: Confirm the underlying IP-based internal-traffic rule
(Admin → Data Streams → stream → Configure tag settings → Define internal
traffic) is actually configured and correct, then flip the filter to
**Active**.

**Status**: ⬜ NOT STARTED — needs IP-rule verification before flipping to Active (deliberately left for the property owner to confirm)

---

### 11. Event data retention bumped to 14 months

**Issue**: Event data retention was at GA4's default of 2 months (User data
was already at 14 months). Only affects Explore/analysis-hub reports built
on unaggregated event data, not standard aggregated reports — but there's
no downside to the longer window.

**Fix**: Changed Admin → Data Streams (property) → Data retention → Event
data from 2 months to 14 months.

**Status**: ✅ IMPLEMENTED

---

### 12. Tag diagnostics flagged undeclared cross-domain hosts

**Finding**: Google's Tag Diagnostics shows "Additional domains detected
for configuration" under Cross-domain Linking. The suggested list surfaced
was unrelated Vercel preview URLs from a different project, not
`aws-services.synepho.com` itself — could not confirm either way whether it
appears further down the list. This only matters for **session continuity**
when a visitor clicks between two of the account's own domains (e.g. the
footer's Synepho logo link, `aws-services.synepho.com` → `synepho.com`) —
without it, that hop starts a new GA4 session instead of continuing one.

**Status**: ⬜ NOT STARTED — LOW PRIORITY, only relevant if cross-site session continuity is wanted
