# AWS Services Dashboard

> Real-time AWS infrastructure visualization across all regions and services

**Live Site**: [https://aws-services.synepho.com](https://aws-services.synepho.com)

![Version](https://img.shields.io/badge/version-2.6.2-blue)
![Status](https://img.shields.io/badge/status-production-success)
![React](https://img.shields.io/badge/react-18.3.1-blue)
![Vite](https://img.shields.io/badge/vite-7.3.7-646CFF)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Documentation](#documentation)

---

## 🎯 Overview

AWS Services Dashboard is a modern web application that provides comprehensive visualization of AWS service availability across all global regions. It replaces traditional Excel-based reporting with an interactive, real-time dashboard that updates daily with the latest AWS infrastructure data.

### Purpose

- **Visualize AWS Infrastructure** - Display service availability across 38+ AWS regions
- **Track Coverage** - Monitor regional service coverage and availability trends
- **Export Data** - Generate custom CSV and Excel reports
- **Research Tool** - Help developers and architects make informed decisions about AWS service availability

### Data Source

- **Source**: AWS Systems Manager Parameter Store (official AWS metadata)
- **Update Frequency**: Daily at 2:00 AM UTC
- **Distribution**: CloudFront CDN with global edge caching
- **Backend**: AWS Lambda functions for data fetching and processing

---

## ✨ Features

### 🎨 User Interface
- **Light/Dark Mode**: Toggle between light and dark themes with one click
- **Theme Persistence**: Your theme preference is saved automatically
- **Mobile Navigation**: Responsive hamburger menu for seamless mobile experience
- **Accessible Design**: Keyboard shortcuts and ARIA labels for screen readers

### 📊 Dashboard
- **Key Metrics**: Total regions, services, and service mappings
- **Statistics**: Average coverage, most/least covered regions
- **Quick Actions**: Direct access to regions, services, and report center
- **Real-time Updates**: Data freshness indicator with last update timestamp

### 🌍 Regions View
- **Regional Browse**: Grid and table views of all AWS regions
- **Service Counts**: Number of available services per region
- **Coverage Analysis**: Visual coverage percentages with color coding
- **Multi-Term Search**: Comma-separated search with OR logic (e.g., `us-, ap-` finds all US and Asia Pacific regions)
- **Search & Filter**: Real-time search and coverage-based filtering
- **Detail Modals**: Click any region for detailed service lists and metadata
- **CSV Export**: Export all regions or region-specific data

### 🔧 Services View
- **Service Catalog**: Browse all 394+ AWS services
- **Regional Availability**: See which regions support each service
- **Coverage Metrics**: Track service availability across regions
- **Multi-Term Search**: Comma-separated search (e.g., `lambda, s3` finds both services)
- **Search & Sort**: Filter by name, code, or coverage percentage
- **Detail Modals**: View regions where each service is available
- **CSV Export**: Export all services or service-specific data

### 📈 Coverage Matrix
- **Complete Matrix**: Service × Region availability heatmap
- **Visual Indicators**: Color-coded availability (✅ Available, ✗ Not Available)
- **Advanced Filtering**: Filter by service, region, or category
- **Multi-Term Search**: Comma-separated search across services and regions
- **CSV Export**: Download complete coverage matrix

### 📥 Report Center
- **Excel Reports**: Pre-formatted Excel workbook with multiple worksheets
- **Quick CSV Exports**: One-click CSV downloads for regions, services, and coverage
- **Custom Reports**: Generate detailed reports for specific regions or services
- **Summary Metadata**: All exports include comprehensive metadata headers

### ℹ️ About Page
- **Hero Section**: Centered tagline "Built by a cloud architect, for cloud architects"
- **About the Creator**: Professional bio with profile picture (text-wrapped layout)
- **Why I Built This**: Story-driven explanation with visual pain points
- **Statistics Cards**: Quick stats (38 regions, 394+ services, daily updates)
- **Features Grid**: Visual feature showcase with emoji icons
- **Collapsible Tech Stack**: Expandable technology details for developers
- **Data Source**: Simplified with expandable technical details

---

## 🛠 Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework with Context API for theme management |
| **Vite** | 7.3.7 | Build tool and dev server (10-100x faster than CRA) |
| **React Router** | 7.18.4 | Client-side routing |
| **TanStack Query** | 5.90.5 | Data fetching, caching, and synchronization |
| **Tailwind CSS** | 3.4.19 | Utility-first CSS framework with dark mode support |
| **Headless UI** | 2.2.9 | Accessible UI components |
| **Recharts** | 3.3.0 | React-based charting library |
| **date-fns** | 4.1.0 | Date formatting and manipulation |

### Backend Infrastructure
- **CloudFront CDN**: EBTYLWOK3WVOK
- **S3 Bucket**: www.aws-services.synepho.com
- **Lambda Functions**: Data fetching and Excel generation
- **Systems Manager**: Parameter Store data access
- **Route 53**: DNS management

### Development Tools
- **ESLint 9**: Code linting and quality (flat config in `eslint.config.js`)
- **Husky + lint-staged + gitleaks + commitlint**: Pre-commit linting, merge-conflict and secret scanning, Conventional Commit messages
- **PostCSS**: CSS processing with Autoprefixer
- **GitHub Actions**: CI/CD pipeline

---

## 🚀 Getting Started

### Prerequisites

```bash
# Node.js 18+ required
node --version

# npm 9+ required
npm --version
```

### Installation

```bash
# Clone the repository
git clone https://github.com/jxman/aws-services-site.git
cd aws-services-site

# Install dependencies
npm install
```

### Running Locally

```bash
# Start development server
npm run dev

# Server will start at http://localhost:3000
```

The dev server uses a Vite proxy to fetch data from production, so you don't need to maintain local data files.

### Building for Production

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
aws-services-site/
├── public/                 # Static assets
│   ├── profile.png        # Local profile picture (CSP compliant)
│   └── sitemap.xml        # SEO sitemap
│
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Shared components (Loading, Error, Modals)
│   │   ├── layout/         # Layout components (Header, Footer, Container)
│   │   └── news/           # News-related components (planned)
│   │
│   ├── views/              # Page-level components
│   │   ├── Dashboard.jsx   # Home page with key metrics
│   │   ├── Regions.jsx     # Regions browsing and filtering
│   │   ├── Services.jsx    # Services catalog and search
│   │   ├── Coverage.jsx    # Service × Region matrix
│   │   ├── Reports.jsx     # Report center with exports
│   │   └── About.jsx       # Redesigned About page with hero section
│   │
│   ├── contexts/           # React Context providers
│   │   └── ThemeContext.jsx # Theme state management and persistence
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAWSData.js   # Data fetching and caching
│   │   └── usePageTracking.js # Google Analytics page tracking
│   │
│   ├── utils/              # Helper functions
│   │   ├── analytics.js    # Google Analytics tracking functions
│   │   ├── calculations.js # Coverage and statistics calculations
│   │   ├── formatters.js   # Number, date, percentage formatting
│   │   ├── constants.js    # Coverage colors and chart constants
│   │   └── searchUtils.js  # Multi-term search parsing and matching
│   │
│   ├── config/             # Configuration
│   │   └── aws-config.js   # Data URLs and endpoints
│   │
│   ├── styles/             # Global styles
│   │   └── index.css       # Tailwind imports and custom CSS
│   │
│   ├── App.jsx             # Root component with routing and ThemeProvider
│   └── main.jsx            # Application entry point
│
├── docs/                   # Documentation
│   ├── DESIGN_PLAN.md                    # Original design specifications
│   ├── DEV_INSTRUCTIONS.md               # Development guide
│   ├── DEPLOYMENT.md                     # Deployment procedures
│   ├── AWS_NEWS_INTEGRATION_PLAN.md      # Future enhancements
│   └── archive/                          # Historical documentation
│
├── dist/                   # Build output (gitignored)
├── node_modules/           # Dependencies (gitignored)
│
├── scripts/                # Automation scripts
│   └── deploy.sh          # Automated deployment script
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── package-lock.json      # Locked dependency versions
├── vite.config.js         # Vite configuration
├── eslint.config.js       # ESLint flat config
├── commitlint.config.js   # Conventional Commits rules
├── .husky/                # Git hooks (pre-commit, commit-msg)
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
├── .gitignore             # Git ignore patterns
└── README.md              # This file
```

---

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Development Workflow

1. **Make Changes**: Edit files in `src/`
2. **Test Locally**: Verify changes at http://localhost:3000
3. **Run Linter**: `npm run lint` to check code quality
4. **Build**: `npm run build` to ensure production build works
5. **Deploy**: Use `npm run deploy` (or `./scripts/deploy.sh`) to deploy to production

### Data Fetching

#### Development
- Vite proxy forwards `/data/*` requests to production CDN
- Allows local development with real production data
- No need to download or maintain local data files

#### Production
- Data served from same CloudFront distribution
- Cached at edge locations (5-minute TTL)
- Updated daily by Lambda function at 2:00 AM UTC

### Adding New Features

1. **Create Component**: Add to `src/components/` or `src/views/`
2. **Add Route** (if page): Update `src/App.jsx`
3. **Add Hook** (if needed): Create in `src/hooks/`
4. **Update Navigation**: Modify `src/components/layout/Header.jsx`
5. **Test**: Verify locally before deploying
6. **Document**: Update this README if adding major features

---

## 🚢 Deployment

### Automated Deployment

```bash
# Deploy to production (recommended)
npm run deploy
# or directly:
./scripts/deploy.sh
```

The deployment script:
1. Builds production bundle
2. Creates backup of current site
3. Uploads to S3 (preserving `/data/` and `/reports/`)
4. Sets appropriate cache headers
5. Invalidates CloudFront cache
6. Waits for invalidation completion

### Manual Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed manual deployment steps.

### Deployment Checklist

Before deploying:
- ✅ Test locally (`npm run dev`)
- ✅ Build successfully (`npm run build`)
- ✅ No linting errors (`npm run lint`)
- ✅ Browser console shows no errors
- ✅ All routes work correctly
- ✅ Data loads properly

After deploying:
- ✅ Site loads at https://aws-services.synepho.com
- ✅ Dashboard shows real data
- ✅ All navigation links work
- ✅ CSV exports function correctly
- ✅ Mobile responsive design works
- ✅ No console errors in production

### Rollback

```bash
# Restore from backup
aws s3 cp /tmp/aws-dashboard-backups/backup-YYYYMMDD-HHMMSS.html \
  s3://www.aws-services.synepho.com/index.html

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id EBTYLWOK3WVOK \
  --paths "/*"
```

---

## 📚 Documentation

### Core Documentation
- **[DESIGN_PLAN.md](./docs/DESIGN_PLAN.md)** - Original architecture and design specifications
- **[DEV_INSTRUCTIONS.md](./docs/DEV_INSTRUCTIONS.md)** - Development setup and workflows
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Deployment procedures and troubleshooting
- **[AWS_NEWS_INTEGRATION_PLAN.md](./docs/AWS_NEWS_INTEGRATION_PLAN.md)** - Future feature plan

### Architecture Notes
- **Region Name Handling**: Region names are sourced dynamically from the API (`complete-data.json`) rather than hardcoded constants. This ensures automatic updates when AWS launches new regions with zero code changes required.

### External Resources
- **Data Source**: [AWS Infrastructure Fetcher](https://github.com/jxman/aws-infrastructure-fetcher)
- **Data Contract**: [Data Contract Documentation](https://github.com/jxman/aws-infrastructure-fetcher/blob/main/DATA_CONTRACT.md)
- **Excel Reporter**: [NodeJS AWS Reporter](https://github.com/jxman/nodejs-aws-reporter)

### API Endpoints

```
# Production Data
https://aws-services.synepho.com/data/complete-data.json    # Complete dataset (239 KB)
https://aws-services.synepho.com/data/regions.json          # Regions metadata
https://aws-services.synepho.com/data/services.json         # Services catalog
https://aws-services.synepho.com/data/service-names.json    # Service name mappings

# Excel Reports
https://aws-services.synepho.com/reports/aws-service-report-latest.xlsx
```

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--primary: #ff9900;        /* AWS Orange */
--primary-dark: #ec7211;
--primary-light: #ffac31;

/* Dark Mode Colors */
--bg-primary: #0f1419;     /* Dark background */
--bg-secondary: #1a1f2e;   /* Card backgrounds */
--bg-tertiary: #232936;    /* Hover states */
--text-primary: #ffffff;
--text-secondary: #9ca3af;
--border: #374151;

/* Light Mode Colors */
--bg-light-primary: #f9fafb;     /* Light background */
--bg-light-secondary: #ffffff;   /* Card backgrounds */
--bg-light-tertiary: #f3f4f6;    /* Hover states */
--text-light-primary: #111827;
--text-light-secondary: #6b7280;
--border-light: #e5e7eb;

/* Status Colors */
--success: #10b981;        /* Available/High coverage */
--warning: #f59e0b;        /* Partial coverage */
--error: #ef4444;          /* Unavailable/Low coverage */
```

### Theme System
- **Default**: Dark mode (preserves original design)
- **Toggle**: Sun/Moon icon button in header
- **Persistence**: Theme preference saved to localStorage
- **Responsive**: All components support both light and dark modes

### Typography
- **Headings**: Inter (700)
- **Body**: Inter (400)
- **Monospace**: System monospace for codes/IDs

---

## 🔧 Configuration

### Environment Variables

No environment variables required for development. All configuration is in:
- `src/config/aws-config.js` - Data URLs
- `vite.config.js` - Vite/proxy configuration
- `tailwind.config.js` - Tailwind customization

### Build Configuration

```javascript
// vite.config.js
{
  server: {
    proxy: {
      '/data': 'https://aws-services.synepho.com'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'query-vendor': ['@tanstack/react-query']
        }
      }
    }
  }
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### "Failed to fetch data" Error
```bash
# Check dev server is running
npm run dev

# Verify proxy configuration in vite.config.js
# Restart dev server after config changes
```

#### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json dist .vite
npm install
npm run build
```

#### Site Shows Old Version
```bash
# Clear browser cache (Cmd+Shift+R on Mac)
# Wait 1-2 minutes for CloudFront invalidation
# Check invalidation status in AWS Console
```

#### Data Not Loading in Production
```bash
# Verify data files exist
aws s3 ls s3://www.aws-services.synepho.com/data/

# Test data fetch
curl https://aws-services.synepho.com/data/complete-data.json | jq '.metadata'
```

---

## 📊 Performance

### Metrics
- **Bundle Size**: < 500 KB (gzipped)
- **Time to Interactive**: < 2s on 3G
- **First Contentful Paint**: < 1s
- **Lighthouse Score**: > 90

### Optimization Techniques
- Code splitting by route
- Tree shaking for smaller bundles
- Memoization to prevent unnecessary re-renders
- TanStack Query for efficient data caching
- CloudFront CDN for global edge caching

---

## 🔒 Security

- ✅ HTTPS only via CloudFront
- ✅ Content Security Policy headers
- ✅ CORS configured for data access
- ✅ No sensitive data (all AWS metadata is public)
- ✅ Regular dependency updates
- ✅ ESLint security rules

---

## 🤝 Contributing

This is a personal project, but suggestions and bug reports are welcome!

1. Open an issue describing the problem or feature
2. If contributing code, fork the repository
3. Create a feature branch
4. Make your changes with clear commit messages
5. Submit a pull request

---

## 📝 License

This project is private and proprietary.

---

## 🙏 Acknowledgments

- **AWS** - For comprehensive Parameter Store metadata
- **React Team** - For an excellent UI framework
- **Vite Team** - For blazing fast build tooling
- **TanStack** - For powerful data fetching and caching

---

## 📧 Contact

- **Website**: [https://aws-services.synepho.com](https://aws-services.synepho.com)
- **Repository**: [GitHub](https://github.com/jxman/aws-services-site)
- **Related Projects**:
  - [AWS Infrastructure Fetcher](https://github.com/jxman/aws-infrastructure-fetcher)
  - [NodeJS AWS Reporter](https://github.com/jxman/nodejs-aws-reporter)

---

## 🔄 Recent Changes

### October 7, 2026 - Snyk Dependency Vulnerability Fixes (Vite 7, ESLint 9)
- ✅ **Ran Snyk SCA + Code (SAST) scans** - Code scan clean (0 issues); SCA found 45 dependency issues (2 critical), reduced to 4 dev-only issues with no available fix
  - `dompurify` 3.4.13 → 3.4.16 (2x XSS), `postcss` 8.5.6 → 8.5.29 (XSS, directory traversal)
  - `vite` 5.4 → 7.3.7 and `@vitejs/plugin-react` 4 → 5 - fixed critical esbuild insecure-download issue plus Vite/Rollup directory traversal
  - `eslint` 8 → 9.39 - ESLint 8 is end-of-life; fixed 15 transitive issues including critical `flatted` prototype pollution. Migrated `.eslintrc.cjs` to flat `eslint.config.js` with the same rule set
  - `postcss-selector-parser` overridden to 7.1.6 (built CSS verified byte-identical)
  - `npm update` for in-range patches (nanoid, browserslist, glob, minimatch, brace-expansion, picomatch, @babel/core)
- ✅ **Fixed vendor chunking** - Vite 7 left `react-vendor` empty with the object-form `manualChunks`; switched to a function so React, router, and TanStack Query split as before
- ✅ **Added pre-commit hooks** - Husky + lint-staged (ESLint on staged files), merge-conflict marker check, gitleaks secret scan, commitlint (Conventional Commits)
- ℹ️ **Remaining accepted risk (dev-only, not shipped)**: `uri-js` (via ESLint 9; fix requires ESLint 10, not yet supported by `eslint-plugin-react`) and `braces` (via Tailwind 3; fix requires Tailwind 4 migration)
- **Files affected**: `package.json`, `package-lock.json`, `vite.config.js`, `eslint.config.js` (new), `.eslintrc.cjs` (removed), `commitlint.config.js` (new), `.husky/` (new)

### August 5, 2026 - Snyk Dependency Vulnerability Fixes
- ✅ **Ran Snyk SCA + Code (SAST) scans** - Code scan came back clean (0 issues); SCA found 6 open-source dependency issues
  - `dompurify` 3.4.11 → 3.4.13 - fixed a low-severity "Incomplete List of Disallowed Inputs" issue
  - `react-router-dom` 7.15.1 → 7.18.2 - fixed 4 issues in transitive `react-router`: high-severity XSS, high-severity Open Redirect, high-severity inefficient algorithmic complexity, and medium-severity CSRF
- ℹ️ **Known accepted risk**: `npm audit` separately flags [GHSA-qwww-vcr4-c8h2](https://github.com/advisories/GHSA-qwww-vcr4-c8h2) (CSRF bypass, fixed only in `react-router@8.3.0`). Confirmed via the advisory and a codebase search that this only affects apps using React Router's unstable RSC APIs, which this Vite + React 18 SPA does not use — left on 7.18.2 rather than forcing a v8 migration
- **Files affected**: `package.json`, `package-lock.json`

### August 5, 2026 - Synepho Brand Logo Integration
- ✅ **Added Synepho wordmark logo** - Replaces plain-text branding across the site
  - New theme-aware `Logo` component (`src/components/common/Logo.jsx`) swaps between light/dark variants based on the active theme
  - Header: logo replaces the "AWS / Services Dashboard" text logo, links to `/`
  - Footer: small linked logo added to the copyright credit line (replacing plain-text "Synepho"), links to [synepho.com](https://synepho.com)
  - About page: logo added next to the "Founder of Synepho" bio line
  - Dark-mode logo asset had its solid background removed (chroma-keyed to transparent) so it composites cleanly against the site's dark theme background
- **Files affected**: `Logo.jsx` (new), `Header.jsx`, `Footer.jsx`, `About.jsx`, `public/logo-light.png` (new), `public/logo-dark.png` (new)

### March 3, 2026 - Footer Buy Me a Coffee Link
- ✅ **Added "Buy me a coffee" link to footer** - Discreet support link in the About section
  - Coffee cup SVG icon with amber/yellow color for visibility
  - Links to [buymeacoffee.com/synepho](https://buymeacoffee.com/synepho)
  - Positioned below the site description in the footer's About column
- **Files affected**: `Footer.jsx`

### February 6, 2026 - Multi-Term Search
- **Multi-term search across all pages** - Use commas to search for multiple terms simultaneously
  - Regions: `us-, ap-` returns all US and Asia Pacific regions
  - Services: `lambda, s3, ec2` returns all three services
  - Coverage Matrix: Same comma-separated search support
  - What's New: Search infrastructure changes and announcements with multiple terms
- **Shared search utility** (`src/utils/searchUtils.js`) with OR logic matching
- **Security safeguards**: Max 10 search terms, 500-character input limit
- **Backward compatible**: Single-term searches work identically to before
- **Files affected**: `searchUtils.js` (new), `Regions.jsx`, `Services.jsx`, `Coverage.jsx`, `TimelineView.jsx`, `AnnouncementsList.jsx`, `ContentContainer.jsx`, `WhatsNewHeader.jsx`

### November 14, 2025 - About Page Redesign & CSP Fix
- ✅ **Complete About Page Redesign** - Modern, professional layout
  - Hero section with tagline "Built by a cloud architect, for cloud architects"
  - Side-by-side layout for "About the Creator" and "Why I Built This" on desktop
  - Text-wrapped profile picture for magazine-style layout
  - Professional first-person bio (changed from third-person)
  - Story-driven "Why I Built This" with visual pain points (red X marks)
  - Statistics cards showing 38 regions, 394+ services, daily updates
  - Visual features grid with emoji icons (📊 🌍 ⚡ 📑 📱 🔍)
  - Collapsible Technology Stack section with animated chevron
  - Simplified Data Source with expandable technical details
  - Consolidated spacing throughout (reduced from space-y-12 to space-y-6)
  - Single coffee CTA at end (removed duplicate)
- ✅ **CSP Compliance Fix** - Resolved Content Security Policy violation
  - Downloaded GitHub profile picture to `public/profile.png`
  - Updated image path from external URL to local `/profile.png`
  - Fixes "Refused to load https://github.com/jxman.png" error
  - Faster loading (same domain), no external dependencies
- **Files affected**: `About.jsx`, `public/profile.png`

### January 13, 2025 - Google Analytics & About Page Updates
- ✅ **Google Analytics Integration** - Implemented comprehensive page tracking
  - Centralized analytics utility (`src/utils/analytics.js`)
  - Custom hook for automatic page view tracking (`src/hooks/usePageTracking.js`)
  - Tracks all current and future routes automatically
  - Captures page paths, query parameters, and titles
- ✅ **Footer Copyright Update** - Enhanced legal and branding information
  - Added "by Synepho" attribution
  - Included AWS disclaimer: "Not affiliated with AWS, Inc."
  - More concise data source reference
- **Files affected**: `App.jsx`, `Footer.jsx`, `src/utils/analytics.js`, `src/hooks/usePageTracking.js`

### October 29, 2025 - Light/Dark Mode & Mobile Navigation
- ✅ **Light/Dark mode toggle** - One-click theme switching with sun/moon icons
- ✅ **Theme persistence** - User preference saved to localStorage
- ✅ **Mobile hamburger menu** - Responsive navigation for mobile devices
- ✅ **Complete theme support** - All 18 components updated with light/dark variants
- ✅ **Preserved dark mode** - Original dark mode colors maintained exactly
- ✅ **Accessible design** - ARIA labels and keyboard navigation support
- ✅ **Mobile improvements** - Full site title visible on all screen sizes
- **Files affected**: All components, views, `ThemeContext.jsx`, `tailwind.config.js`, `index.css`
- **New features**:
  - ThemeContext for global state management
  - Mobile-responsive hamburger menu with auto-close
  - Light mode color palette in Tailwind config
  - Hover states working in both themes

### October 24, 2025 - Dynamic Region Name Refactoring
- ✅ **Removed hardcoded region names** from `src/utils/constants.js` (43 lines eliminated)
- ✅ **Refactored to use API data** - Region names now sourced directly from backend
- ✅ **Zero maintenance for new regions** - New AWS regions appear automatically
- ✅ **Single source of truth** - AWS API → Lambda → CloudFront → Frontend
- **Files affected**: `Regions.jsx`, `Coverage.jsx`, `Reports.jsx`, `ServiceDetailModal.jsx`
- **Benefit**: When AWS launches new regions, they appear with full names within 5 minutes (cache refresh)

---

**Last Updated**: October 7, 2026
**Version**: 2.6.2
**Status**: ✅ Production
