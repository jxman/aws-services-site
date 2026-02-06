# AWS Services Dashboard - Design & Deployment Plan

**Site**: https://aws-services.synepho.com
**Status**: ✅ **COMPLETE AND DEPLOYED**
**Version**: 2.0.0 (Fully Functional Application)
**Last Updated**: October 23, 2025
**Purpose**: Real-time AWS infrastructure visualization across 38 regions and 394+ services

> **Note**: This document contains the original design specifications. All core features have been implemented and deployed. See README.md for current project documentation.

---

## 🎯 Project Overview

### Goals

1. **Visualize AWS infrastructure data** - Display service availability across all AWS regions
2. **Replace Excel reporting** - Modern web alternative to nodejs-aws-reporter output
3. **Real-time insights** - Daily updated data showing AWS service coverage
4. **Developer-friendly** - Clean, fast, accessible dashboard for technical audiences

### Data Source

- **Primary**: `https://aws-data-fetcher-output.s3.amazonaws.com/aws-data/complete-data.json` (239 KB)
- **Supplementary**: regions.json (9.6 KB), services.json (32 KB)
- **Update Frequency**: Daily at 2 AM UTC
- **Data Contract**: https://github.com/jxman/aws-infrastructure-fetcher/blob/main/DATA_CONTRACT.md

### Infrastructure (Already Deployed)

- ✅ CloudFront CDN: EBTYLWOK3WVOK
- ✅ S3 Bucket: www.aws-services.synepho.com
- ✅ SSL Certificate: Valid and issued
- ✅ DNS: Resolving correctly
- ✅ CORS: Configured for data access

---

## 🏗️ Technology Stack Recommendation

### Frontend Framework: **Vite + React 18**

**Why Vite over Create React App:**

- ⚡ **10-100x faster** development server (instant HMR)
- 📦 **Smaller bundle sizes** - Better tree shaking
- 🔧 **Modern tooling** - Native ESM, optimized builds
- 🚀 **Better DX** - Faster refresh, better error messages

```bash
npm create vite@latest . -- --template react
```

### Core Libraries

| Library             | Purpose         | Why                                                 |
| ------------------- | --------------- | --------------------------------------------------- |
| **React Router v6** | Navigation      | Industry standard, declarative routing              |
| **TanStack Query**  | Data fetching   | Caching, background updates, stale-while-revalidate |
| **Recharts**        | Charts/graphs   | React-native, responsive, customizable              |
| **Tailwind CSS**    | Styling         | Utility-first, fast development, small bundle       |
| **Headless UI**     | Components      | Accessible dropdowns, tabs, modals                  |
| **date-fns**        | Date formatting | Lightweight, tree-shakeable (vs moment.js)          |

### Optional Enhancements

| Library            | Use Case                | Priority                            |
| ------------------ | ----------------------- | ----------------------------------- |
| **React Table v8** | Advanced data grids     | High - If complex filtering needed  |
| **Zustand**        | Global state            | Medium - For user preferences       |
| **React Leaflet**  | World map visualization | Medium - For regional distribution  |
| **D3.js**          | Custom visualizations   | Low - Only if Recharts insufficient |

---

## 📐 Application Architecture

### Folder Structure

```
src/
├── components/              # Reusable UI components
│   ├── common/             # Buttons, cards, badges, loaders
│   ├── charts/             # Chart wrappers (bar, pie, line)
│   ├── layout/             # Header, footer, sidebar, navigation
│   └── data-display/       # Tables, matrices, stat cards
│
├── views/                  # Page-level components
│   ├── Dashboard.jsx       # Overview with key metrics
│   ├── Regions.jsx         # Region-focused view
│   ├── Services.jsx        # Service-focused view
│   ├── CoverageMatrix.jsx  # Service × Region heatmap
│   └── About.jsx           # Info about data source
│
├── hooks/                  # Custom React hooks
│   ├── useAWSData.js       # Fetch and cache complete-data.json
│   ├── useRegions.js       # Region-specific data
│   ├── useServices.js      # Service-specific data
│   └── useSearch.js        # Search and filter logic
│
├── utils/                  # Helper functions
│   ├── dataTransform.js    # Parse and reshape AWS data
│   ├── calculations.js     # Coverage %, statistics
│   ├── formatters.js       # Number, date, string formatting
│   ├── constants.js        # AWS region names, colors
│   └── searchUtils.js      # Multi-term search parsing and matching
│
├── config/                 # Configuration
│   ├── aws-config.js       # Data URLs, API endpoints
│   └── routes.js           # Route definitions
│
├── styles/                 # Global styles
│   ├── index.css           # Tailwind imports
│   └── custom.css          # Custom overrides
│
├── App.jsx                 # Root component with router
├── main.jsx                # Entry point
└── vite.config.js          # Build configuration
```

### Routing Structure

```
/ (Dashboard)
├── /regions
│   └── /regions/:regionCode (e.g., /regions/us-east-1)
├── /services
│   └── /services/:serviceCode (e.g., /services/ec2)
├── /coverage
└── /about
```

---

## 🎨 UI/UX Design Approach

### Design System

**Color Palette** (Based on AWS branding + modern dashboard aesthetics)

```css
/* Primary Colors */
--primary: #ff9900; /* AWS Orange */
--primary-dark: #ec7211;
--primary-light: #ffac31;

/* Neutral Colors */
--bg-primary: #0f1419; /* Dark background */
--bg-secondary: #1a1f2e; /* Card backgrounds */
--bg-tertiary: #232936; /* Hover states */
--text-primary: #ffffff;
--text-secondary: #9ca3af;
--border: #374151;

/* Status Colors */
--success: #10b981; /* Service available */
--warning: #f59e0b; /* Partial coverage */
--error: #ef4444; /* Service unavailable */
--info: #3b82f6;
```

**Typography**

- **Headings**: Inter (700) - Clean, modern sans-serif
- **Body**: Inter (400) - Excellent readability
- **Monospace**: JetBrains Mono - For codes, IDs

**Spacing System** (Tailwind scale: 4px base)

```
xs: 0.5rem (8px)
sm: 0.75rem (12px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
```

### Layout Principles

1. **Desktop-First, Mobile-Optimized**

   - Primary audience: Developers on desktops
   - Responsive breakpoints: 640px, 768px, 1024px, 1280px

2. **Information Density**

   - Dashboard users expect data-rich interfaces
   - Use collapsible sections for progressive disclosure
   - Sticky headers on scroll for context

3. **Performance Budget**
   - Initial load: < 1.5s (on 3G)
   - Interaction: < 100ms response time
   - Bundle size: < 200 KB (gzipped)

---

## 📊 View-by-View Design Specification

### 1. Dashboard View (`/`)

**Purpose**: High-level overview with key metrics and recent updates

**Layout**:

```
┌─────────────────────────────────────────────────────────┐
│  Header: AWS Services Dashboard                         │
│  Last Updated: Oct 16, 2025 (17 hours ago)             │
└─────────────────────────────────────────────────────────┘

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   38         │ │   394+       │ │   15,000+    │
│   Regions    │ │   Services   │ │   Mappings   │
└──────────────┘ └──────────────┘ └──────────────┘

┌─────────────────────────────────────────────────────────┐
│  Coverage by Region (Bar Chart)                         │
│  [████████████████████████] us-east-1 (347 services)    │
│  [███████████████████████ ] eu-west-1 (325 services)    │
│  [██████████████████      ] ap-southeast-1 (245)        │
│  ...                                                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Service Availability Trends (Line Chart)               │
│  Shows service count growth over time (if historical)   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Top Services by Availability                           │
│  1. EC2 (38/38 regions) ████████████████████ 100%      │
│  2. S3 (38/38 regions)  ████████████████████ 100%      │
│  3. Lambda (36/38)      ███████████████████  95%       │
│  ...                                                     │
└─────────────────────────────────────────────────────────┘
```

**Key Metrics**:

- Total regions, services, mappings
- Most/least covered regions
- Most/least available services
- Last data update timestamp

**Interactions**:

- Click region bar → Navigate to `/regions/:code`
- Click service → Navigate to `/services/:code`
- Hover for detailed tooltips

---

### 2. Regions View (`/regions`)

**Purpose**: Explore AWS regions and their service availability

**Features**:

**A. Region Cards Grid**

```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  🇺🇸 US East 1   │ │  🇺🇸 US West 2   │ │  🇪🇺 EU West 1   │
│  (N. Virginia)  │ │  (Oregon)       │ │  (Ireland)      │
│                 │ │                 │ │                 │
│  347 services   │ │  325 services   │ │  338 services   │
│  91% coverage   │ │  85% coverage   │ │  89% coverage   │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

**B. Sortable Table View**
| Region | Location | Services | Coverage | Launch Year |
|--------|----------|----------|----------|-------------|
| us-east-1 | N. Virginia | 347 | 91% | 2006 |
| eu-west-1 | Ireland | 338 | 89% | 2007 |
| ... | ... | ... | ... | ... |

**C. World Map Visualization** (Optional)

- Interactive map with region markers
- Color-coded by service count
- Click region → Show details panel

**Filters & Search**:

- 🔍 Multi-term search by region code or name (comma-separated, e.g., `us-, ap-`)
- 📊 Filter by coverage % (e.g., >80%)
- 🌍 Filter by continent/geography
- 📅 Sort by launch year, service count

**Region Detail View** (`/regions/:code`):

```
┌─────────────────────────────────────────────────────────┐
│  US East 1 (N. Virginia) - us-east-1                    │
│  Launched: 2006 | Services: 347/380 (91%)               │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────┐
│  Service Categories Breakdown         │
│  ┌─────────────────────────────────┐ │
│  │ Compute:     ███████████ 45/48  │ │
│  │ Storage:     ████████████ 28/30 │ │
│  │ Database:    ██████████  22/25  │ │
│  │ Networking:  ████████     18/22 │ │
│  │ ...                             │ │
│  └─────────────────────────────────┘ │
└──────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Available Services in this Region (Searchable List)    │
│  ✅ EC2 (Elastic Compute Cloud)                         │
│  ✅ S3 (Simple Storage Service)                         │
│  ✅ Lambda (Serverless Functions)                       │
│  ❌ Nimble Studio (Not available)                       │
│  ...                                                     │
└─────────────────────────────────────────────────────────┘
```

---

### 3. Services View (`/services`)

**Purpose**: Browse AWS services and their regional availability

**Features**:

**A. Service Cards Grid with Icons**

```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  📦 S3          │ │  ⚙️ EC2         │ │  λ Lambda       │
│  Simple Storage │ │  Compute        │ │  Serverless     │
│                 │ │                 │ │                 │
│  38/38 regions  │ │  38/38 regions  │ │  36/38 regions  │
│  100% coverage  │ │  100% coverage  │ │  95% coverage   │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

**B. Categorized List View**

```
▼ Compute (48 services)
  ✅ EC2 (38/38 regions - 100%)
  ✅ Lambda (36/38 regions - 95%)
  ✅ ECS (35/38 regions - 92%)
  ...

▼ Storage (30 services)
  ✅ S3 (38/38 regions - 100%)
  ✅ EBS (38/38 regions - 100%)
  ...
```

**Filters & Search**:

- 🔍 Multi-term search by service name or code (comma-separated, e.g., `lambda, s3`)
- 📂 Filter by category (Compute, Storage, Database, etc.)
- 📊 Filter by coverage % (e.g., global services only)
- 🔤 Sort by name, coverage, region count

**Service Detail View** (`/services/:code`):

```
┌─────────────────────────────────────────────────────────┐
│  Amazon EC2 (Elastic Compute Cloud)                     │
│  Category: Compute | Coverage: 38/38 regions (100%)     │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────┐
│  Regional Availability Map            │
│  [Interactive world map with markers] │
│  ✅ Available (38 regions)            │
│  ❌ Unavailable (0 regions)           │
└──────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Regions Where Available (Grouped by Continent)         │
│  Americas (7)                                            │
│    • us-east-1 (N. Virginia)                            │
│    • us-west-2 (Oregon)                                 │
│    • ca-central-1 (Canada)                              │
│    ...                                                   │
│                                                          │
│  Europe (8)                                              │
│    • eu-west-1 (Ireland)                                │
│    • eu-central-1 (Frankfurt)                           │
│    ...                                                   │
└─────────────────────────────────────────────────────────┘
```

---

### 4. Coverage Matrix View (`/coverage`)

**Purpose**: Comprehensive heatmap showing service × region availability

**Layout**:

```
┌─────────────────────────────────────────────────────────┐
│  Service × Region Coverage Matrix                       │
│  15,000+ mappings | Last Updated: Oct 16, 2025         │
└─────────────────────────────────────────────────────────┘

┌─ Filters ──────────────────────────────────────────────┐
│  Category: [All ▼] Region: [All ▼] Coverage: [All ▼]  │
│  🔍 Search: [______________________________________]   │
└────────────────────────────────────────────────────────┘

         us-east-1  us-west-2  eu-west-1  ap-southeast-1 ...
EC2        ✅         ✅         ✅          ✅           ...
S3         ✅         ✅         ✅          ✅           ...
Lambda     ✅         ✅         ✅          ❌           ...
RDS        ✅         ✅         ✅          ✅           ...
...        ...        ...        ...         ...          ...

Legend:
✅ Available (Green)
❌ Not Available (Red/Gray)
⚠️ Limited Availability (Yellow) - if data supports it
```

**Features**:

- **Sticky headers** - Region codes stay visible on scroll
- **Virtualization** - Only render visible rows (react-window)
- **Export** - Download as CSV
- **Heatmap mode** - Color intensity based on availability
- **Grouping** - Collapse/expand by service category

**Interactions**:

- Click cell → Show service detail in modal
- Click row header (service) → Navigate to service detail
- Click column header (region) → Navigate to region detail
- Hover → Tooltip with service + region info

---

## 🔄 Data Flow Architecture

### Data Fetching Strategy

```javascript
// 1. App Initialization
App.jsx
  └─> useAWSData() hook
      └─> TanStack Query fetches complete-data.json
          ├─> Cache in memory (5 min stale time)
          ├─> Background refetch every 1 hour
          └─> Provide to components via Context

// 2. Component Data Access
Dashboard.jsx
  └─> useAWSData()
      └─> Derive metrics from cached data
          ├─> Total regions/services
          ├─> Coverage calculations
          └─> Top/bottom rankings

Regions.jsx
  └─> useRegions()
      └─> Filter cached data by region criteria

Services.jsx
  └─> useServices()
      └─> Filter cached data by service criteria
```

### Data Transform Pipeline

```javascript
// Raw data structure (from complete-data.json)
{
  metadata: { version, generatedAt, count },
  regions: [ { code, name, location, launchYear } ],
  services: [ { code, name, category, description } ],
  servicesByRegion: [ { region, service, available } ]
}

// Transformed for UI consumption
{
  // For Dashboard
  stats: {
    totalRegions: 38,
    totalServices: 394,
    totalMappings: 15000,
    avgCoverage: 87.3
  },

  // For Regions View
  regionsList: [
    {
      code: "us-east-1",
      name: "US East 1",
      serviceCount: 347,
      coverage: 91.2,
      services: [...service codes...],
      missingServices: [...service codes...]
    }
  ],

  // For Services View
  servicesList: [
    {
      code: "ec2",
      name: "EC2",
      category: "Compute",
      regionCount: 38,
      coverage: 100,
      regions: [...region codes...]
    }
  ],

  // For Coverage Matrix
  matrix: {
    rows: [...services...],
    columns: [...regions...],
    cells: Map<"service-region", boolean>
  }
}
```

### Caching Strategy

```javascript
// TanStack Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: false, // Don't refetch on tab focus
      refetchOnReconnect: true, // Refetch on reconnect
      retry: 3, // Retry failed requests
    },
  },
});

// Custom hook with caching
export const useAWSData = () => {
  return useQuery({
    queryKey: ["aws-data"],
    queryFn: async () => {
      // Use relative path - served from same CloudFront distribution
      // Data is distributed by fetcher Lambda to www.aws-services.synepho.com/data/
      const response = await fetch("/data/complete-data.json");
      if (!response.ok) throw new Error("Failed to fetch data");
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    // Data is fresh for 5 minutes, then marked stale but still shown
    // Background refetch happens automatically when stale
  });
};
```

---

## 🚀 Development Workflow

### Phase 1: Setup & Foundation (Days 1-2)

**Tasks**:

1. ✅ Initialize Vite + React project
2. ✅ Install core dependencies (React Router, TanStack Query, Tailwind)
3. ✅ Configure Tailwind with custom design tokens
4. ✅ Set up folder structure
5. ✅ Create base layout components (Header, Footer, Container)
6. ✅ Implement routing structure
7. ✅ Create `useAWSData` hook with basic fetch

**Deliverable**: Working app skeleton with routing and data fetching

---

### Phase 2: Dashboard View (Days 3-4)

**Tasks**:

1. ✅ Create stat card components
2. ✅ Implement metrics calculations (total regions, services, coverage)
3. ✅ Build bar chart for region coverage (Recharts)
4. ✅ Create top services list component
5. ✅ Add last updated timestamp display
6. ✅ Implement loading and error states

**Deliverable**: Functional dashboard showing overview metrics

---

### Phase 3: Regions View (Days 5-6)

**Tasks**:

1. ✅ Create `useRegions` hook for data transformation
2. ✅ Build region card component
3. ✅ Implement grid layout with responsive design
4. ✅ Add search and filter functionality
5. ✅ Create sortable table view (alternative to cards)
6. ✅ Build region detail page
7. ✅ Add service breakdown chart for region

**Deliverable**: Complete regions browsing experience

---

### Phase 4: Services View (Days 7-8)

**Tasks**:

1. ✅ Create `useServices` hook
2. ✅ Build service card with category icon
3. ✅ Implement categorized list with expand/collapse
4. ✅ Add search and category filters
5. ✅ Create service detail page
6. ✅ Add regional availability visualization
7. ✅ Group regions by continent on detail page

**Deliverable**: Complete services browsing experience

---

### Phase 5: Coverage Matrix (Days 9-10)

**Tasks**:

1. ✅ Research virtualization solution (react-window or react-virtual)
2. ✅ Build matrix component with sticky headers
3. ✅ Implement cell rendering with color coding
4. ✅ Add filters and search
5. ✅ Create export to CSV functionality
6. ✅ Optimize performance (memoization, virtualization)
7. ✅ Add tooltips and interactions

**Deliverable**: Interactive coverage matrix

---

### Phase 6: Polish & Optimization (Days 11-12)

**Tasks**:

1. ✅ Add loading skeletons for all views
2. ✅ Implement error boundaries
3. ✅ Add 404 page
4. ✅ Optimize bundle size (lazy loading routes)
5. ✅ Add accessibility features (keyboard navigation, ARIA labels)
6. ✅ Performance audit and optimization
7. ✅ Cross-browser testing
8. ✅ Mobile responsiveness review

**Deliverable**: Production-ready application

---

### Phase 7: Deployment (Day 13)

**Tasks**:

1. ✅ Build production bundle (`npm run build`)
2. ✅ Test production build locally
3. ✅ Upload to S3: `aws s3 sync dist/ s3://www.aws-services.synepho.com/`
4. ✅ Invalidate CloudFront cache
5. ✅ Verify deployment at https://aws-services.synepho.com
6. ✅ Set up monitoring (CloudWatch, error tracking)

**Deliverable**: Live production site

---

## 📈 Performance Optimization Strategy

### Bundle Size Optimization

**Target**: < 200 KB gzipped total bundle

**Techniques**:

1. **Code Splitting** - Lazy load routes

   ```javascript
   const Dashboard = lazy(() => import("./views/Dashboard"));
   const Regions = lazy(() => import("./views/Regions"));
   ```

2. **Tree Shaking** - Import only what you need

   ```javascript
   // ❌ Bad
   import _ from "lodash";

   // ✅ Good
   import sortBy from "lodash/sortBy";
   ```

3. **Lightweight Alternatives**
   - date-fns instead of moment.js (save ~200KB)
   - Recharts instead of Chart.js (smaller, React-native)
   - Headless UI instead of Material-UI (save ~100KB)

### Runtime Performance

**Targets**:

- Time to Interactive: < 2s
- First Contentful Paint: < 1s
- Lighthouse Score: > 90

**Techniques**:

1. **Memoization** - Prevent unnecessary re-renders

   ```javascript
   const sortedRegions = useMemo(
     () => regions.sort((a, b) => b.serviceCount - a.serviceCount),
     [regions]
   );
   ```

2. **Virtualization** - Only render visible items

   ```javascript
   <FixedSizeList height={600} itemCount={services.length} itemSize={60}>
     {ServiceRow}
   </FixedSizeList>
   ```

3. **Debouncing** - Optimize search/filter
   ```javascript
   const debouncedSearch = useDebouncedValue(searchTerm, 300);
   ```

### Network Optimization

1. **HTTP/2** - Already enabled via CloudFront
2. **Compression** - Gzip/Brotli via CloudFront
3. **Caching** - Browser cache + TanStack Query cache
4. **Preload Critical Data** - Fetch on app load
   ```html
   <link
     rel="preload"
     href="https://aws-data-fetcher-output.s3.amazonaws.com/aws-data/complete-data.json"
     as="fetch"
     crossorigin
   />
   ```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)

**Coverage Target**: > 80%

**Test Files**:

```
src/
├── utils/
│   ├── dataTransform.test.js  # Test data parsing logic
│   ├── calculations.test.js   # Test coverage calculations
│   └── formatters.test.js     # Test formatting utilities
│
├── hooks/
│   ├── useAWSData.test.js     # Mock fetch, test caching
│   └── useSearch.test.js      # Test search/filter logic
│
└── components/
    └── RegionCard.test.jsx    # Component rendering tests
```

**Example Test**:

```javascript
describe("calculateCoverage", () => {
  it("calculates percentage correctly", () => {
    const result = calculateCoverage(347, 380);
    expect(result).toBe(91.3);
  });

  it("handles edge cases", () => {
    expect(calculateCoverage(0, 0)).toBe(0);
    expect(calculateCoverage(10, 10)).toBe(100);
  });
});
```

### Integration Tests (React Testing Library)

**Key Flows to Test**:

1. Data fetching and display
2. Navigation between views
3. Search and filter functionality
4. Error handling (network errors, data errors)

### E2E Tests (Playwright) - Optional

**Critical User Journeys**:

1. View dashboard → Click region → See region details
2. Search for service → View service detail → See regional availability
3. Open coverage matrix → Filter by category → Export CSV

---

## 🔐 Security Considerations

### Data Handling

- ✅ **No sensitive data** - All AWS metadata is public information
- ✅ **CORS configured** - Only allow aws-services.synepho.com + localhost
- ✅ **HTTPS only** - Enforce via CloudFront
- ✅ **Content Security Policy** - Add CSP headers

### Best Practices

```javascript
// Recommended CSP (add to index.html)
<meta http-equiv="Content-Security-Policy"
      content="
        default-src 'self';
        script-src 'self' 'unsafe-inline';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        connect-src 'self' https://aws-data-fetcher-output.s3.amazonaws.com;
      ">
```

### Dependency Security

```bash
# Regular security audits
npm audit
npm audit fix

# Keep dependencies updated
npm outdated
npm update
```

---

## 📊 Analytics & Monitoring

### CloudWatch Integration

**Metrics to Track**:

- Page views per route
- Data fetch success/failure rates
- Average load times
- User session duration

**Custom Metrics** (via CloudWatch Logs):

```javascript
// Log client-side errors
window.addEventListener("error", (event) => {
  console.error("Client error:", event.error);
  // Send to CloudWatch Logs via Lambda
});

// Log performance metrics
if ("PerformanceObserver" in window) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log(`${entry.name}: ${entry.duration}ms`);
      // Send to CloudWatch
    }
  });
  observer.observe({ entryTypes: ["navigation", "resource"] });
}
```

### User Analytics (Privacy-Friendly)

**Options**:

1. **Plausible Analytics** - Privacy-focused, no cookies
2. **Umami** - Self-hosted, open-source
3. **CloudWatch RUM** - AWS native solution

---

## 🎯 Success Metrics

### Technical Metrics

- ✅ **Lighthouse Score**: > 90 (Performance, Accessibility, Best Practices, SEO)
- ✅ **Bundle Size**: < 200 KB gzipped
- ✅ **Time to Interactive**: < 2s on 3G
- ✅ **API Response Time**: < 500ms (S3 fetch)
- ✅ **Error Rate**: < 1%

### User Experience Metrics

- ✅ **Bounce Rate**: < 40%
- ✅ **Avg Session Duration**: > 2 minutes
- ✅ **Pages per Session**: > 3
- ✅ **Search Usage**: > 30% of users

### Business Metrics

- ✅ **Daily Active Users**: Track growth
- ✅ **Top Viewed Regions**: Understand user interest
- ✅ **Top Viewed Services**: Identify popular services
- ✅ **Data Update Success**: 100% daily updates

---

## 🚢 Deployment Process

### Pre-Deployment Checklist

```bash
# 1. Run tests
npm run test

# 2. Run linting
npm run lint

# 3. Check bundle size
npm run build
du -sh dist/

# 4. Test production build locally
npm run preview

# 5. Accessibility audit
npm run a11y  # (lighthouse CI)
```

### Deployment Commands

```bash
# Build for production
npm run build

# Upload to S3
aws s3 sync dist/ s3://www.aws-services.synepho.com/ --delete

# Set cache headers
aws s3 cp dist/index.html s3://www.aws-services.synepho.com/index.html \
  --cache-control "no-cache,no-store,must-revalidate" \
  --content-type "text/html"

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id EBTYLWOK3WVOK \
  --paths "/*"

# Verify deployment
curl -I https://aws-services.synepho.com
```

### Rollback Strategy

```bash
# List S3 versions
aws s3api list-object-versions \
  --bucket www.aws-services.synepho.com \
  --prefix index.html

# Restore previous version
aws s3api copy-object \
  --bucket www.aws-services.synepho.com \
  --copy-source www.aws-services.synepho.com/index.html?versionId=VERSION_ID \
  --key index.html

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id EBTYLWOK3WVOK \
  --paths "/*"
```

---

## 📋 Implementation Checklist

### Foundation ✅ COMPLETE

- [x] Initialize Vite + React project
- [x] Install dependencies (Router, TanStack Query, Tailwind, Recharts)
- [x] Configure Tailwind with design tokens
- [x] Set up folder structure
- [x] Create base layout (Header, Footer, Navigation)
- [x] Implement routing
- [x] Create `useAWSData` hook

### Dashboard View ✅ COMPLETE

- [x] Stat cards (regions, services, mappings)
- [x] Coverage by region bar chart
- [x] Top services list
- [x] Last updated display
- [x] Loading states

### Regions View ✅ COMPLETE

- [x] Region cards grid
- [x] Search and filters
- [x] Sortable table view
- [x] Region detail modal (implemented as modal, not separate page)
- [x] Service breakdown display
- [x] CSV export functionality

### Services View ✅ COMPLETE

- [x] Service cards display
- [x] Complete service catalog
- [x] Search and filters
- [x] Service detail modal (implemented as modal, not separate page)
- [x] Regional availability display
- [x] CSV export functionality

### Coverage Matrix ✅ COMPLETE

- [x] Full coverage table (non-virtualized, all data displayed)
- [x] Sticky headers
- [x] Color-coded cells (✅ Available, ✗ Not Available)
- [x] Filters and search
- [x] Export to CSV

### Reports Center ✅ COMPLETE (Additional Feature)

- [x] Excel report download
- [x] Quick CSV exports (regions, services, coverage)
- [x] Custom region/service-specific exports
- [x] Summary metadata in all exports

### Polish ✅ COMPLETE

- [x] Loading states with messages
- [x] Error handling and display
- [x] About page (replaces 404 with informative content)
- [x] Accessibility (keyboard nav, semantic HTML)
- [x] Mobile responsiveness (all views)
- [x] Performance optimization (React Query caching, memoization)
- [x] Cross-browser compatibility

### Deployment ✅ COMPLETE

- [x] Production build
- [x] S3 upload with automated script
- [x] CloudFront invalidation
- [x] Monitoring setup (CloudWatch dashboard)
- [x] Documentation (README, DEV_INSTRUCTIONS, DEPLOYMENT)

---

## 🔮 Future Enhancements (Post-Launch)

### Phase 2 Features

1. **Historical Data Tracking**

   - Show service availability trends over time
   - Compare coverage between dates
   - Visualize AWS expansion

2. **Advanced Filtering**

   - Save filter preferences
   - Create custom views
   - Bookmark favorite regions/services

3. **Collaboration Features**

   - Share filtered views via URL
   - Export custom reports
   - Email notifications for new services

4. **Dark/Light Mode**

   - Theme toggle
   - Persist preference
   - System preference detection

5. **PWA Support**
   - Offline access to last fetched data
   - Install as app
   - Push notifications for updates

### Phase 3 Features

1. **API Endpoints** (if needed)

   - GraphQL API for flexible queries
   - REST endpoints for integrations
   - Webhook support for updates

2. **Admin Dashboard**
   - Data source management
   - Usage analytics
   - Error monitoring

---

## 📚 Additional Resources

### Documentation to Reference

- **Data Contract**: https://github.com/jxman/aws-infrastructure-fetcher/blob/main/DATA_CONTRACT.md
- **Data Source**: https://github.com/jxman/aws-infrastructure-fetcher
- **Excel Report Reference**: https://github.com/jxman/nodejs-aws-reporter

### Technology Documentation

- **Vite**: https://vitejs.dev
- **React**: https://react.dev
- **TanStack Query**: https://tanstack.com/query/latest
- **Recharts**: https://recharts.org
- **Tailwind CSS**: https://tailwindcss.com
- **React Router**: https://reactrouter.com

### Design Inspiration

- **AWS Console**: https://console.aws.amazon.com
- **Grafana Dashboards**: https://grafana.com
- **Datadog**: https://www.datadoghq.com
- **Linear**: https://linear.app (for clean UI/UX)

---

## 🎬 Next Steps

1. **Review this design plan** - Validate architecture and tech choices
2. **Set up development environment** - Initialize project
3. **Begin Phase 1** - Foundation setup (Days 1-2)
4. **Iterate quickly** - Build incrementally, deploy often
5. **Gather feedback** - Test with users, refine based on input

---

**Estimated Timeline**: 13 days (2 weeks)
**Estimated Effort**: 80-100 hours
**Team Size**: 1-2 developers
**Go-Live Date**: Flexible (infrastructure ready now)

🚀 **Ready to build when you are!**
