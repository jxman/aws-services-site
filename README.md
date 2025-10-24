# AWS Services Dashboard

> Real-time AWS infrastructure visualization across all regions and services

**Live Site**: [https://aws-services.synepho.com](https://aws-services.synepho.com)

![Version](https://img.shields.io/badge/version-2.1.0-blue)
![Status](https://img.shields.io/badge/status-production-success)
![React](https://img.shields.io/badge/react-18.3.1-blue)
![Vite](https://img.shields.io/badge/vite-5.3.1-646CFF)

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

### 📊 Dashboard
- **Key Metrics**: Total regions, services, and service mappings
- **Statistics**: Average coverage, most/least covered regions
- **Quick Actions**: Direct access to regions, services, and report center
- **Real-time Updates**: Data freshness indicator with last update timestamp

### 🌍 Regions View
- **Regional Browse**: Grid and table views of all AWS regions
- **Service Counts**: Number of available services per region
- **Coverage Analysis**: Visual coverage percentages with color coding
- **Search & Filter**: Real-time search and coverage-based filtering
- **Detail Modals**: Click any region for detailed service lists and metadata
- **CSV Export**: Export all regions or region-specific data

### 🔧 Services View
- **Service Catalog**: Browse all 394+ AWS services
- **Regional Availability**: See which regions support each service
- **Coverage Metrics**: Track service availability across regions
- **Search & Sort**: Filter by name, code, or coverage percentage
- **Detail Modals**: View regions where each service is available
- **CSV Export**: Export all services or service-specific data

### 📈 Coverage Matrix
- **Complete Matrix**: Service × Region availability heatmap
- **Visual Indicators**: Color-coded availability (✅ Available, ✗ Not Available)
- **Advanced Filtering**: Filter by service, region, or category
- **Search**: Real-time search across services and regions
- **CSV Export**: Download complete coverage matrix

### 📥 Report Center
- **Excel Reports**: Pre-formatted Excel workbook with multiple worksheets
- **Quick CSV Exports**: One-click CSV downloads for regions, services, and coverage
- **Custom Reports**: Generate detailed reports for specific regions or services
- **Summary Metadata**: All exports include comprehensive metadata headers

### ℹ️ About Page
- **Architecture Info**: Details about data sources and infrastructure
- **Technology Stack**: Complete list of technologies used
- **Update Schedule**: Information about data refresh cycles
- **Contact Information**: Links to related projects and documentation

---

## 🛠 Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **Vite** | 5.3.1 | Build tool and dev server (10-100x faster than CRA) |
| **React Router** | 7.9.4 | Client-side routing |
| **TanStack Query** | 5.90.5 | Data fetching, caching, and synchronization |
| **Tailwind CSS** | 3.4.18 | Utility-first CSS framework |
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
- **ESLint**: Code linting and quality
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
│   │   └── About.jsx       # About page and documentation
│   │
│   ├── hooks/              # Custom React hooks
│   │   └── useAWSData.js   # Data fetching and caching
│   │
│   ├── utils/              # Helper functions
│   │   ├── calculations.js # Coverage and statistics calculations
│   │   ├── formatters.js   # Number, date, percentage formatting
│   │   └── constants.js    # Coverage colors and chart constants
│   │
│   ├── config/             # Configuration
│   │   └── aws-config.js   # Data URLs and endpoints
│   │
│   ├── styles/             # Global styles
│   │   └── index.css       # Tailwind imports and custom CSS
│   │
│   ├── App.jsx             # Root component with routing
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
├── deploy.sh              # Automated deployment script
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── package-lock.json      # Locked dependency versions
├── vite.config.js         # Vite configuration
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
5. **Deploy**: Use `./deploy.sh` to deploy to production

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
./deploy.sh
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

/* Background Colors */
--bg-primary: #0f1419;     /* Dark background */
--bg-secondary: #1a1f2e;   /* Card backgrounds */
--bg-tertiary: #232936;    /* Hover states */

/* Text Colors */
--text-primary: #ffffff;
--text-secondary: #9ca3af;
--border: #374151;

/* Status Colors */
--success: #10b981;        /* Available/High coverage */
--warning: #f59e0b;        /* Partial coverage */
--error: #ef4444;          /* Unavailable/Low coverage */
```

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

### October 24, 2025 - Dynamic Region Name Refactoring
- ✅ **Removed hardcoded region names** from `src/utils/constants.js` (43 lines eliminated)
- ✅ **Refactored to use API data** - Region names now sourced directly from backend
- ✅ **Zero maintenance for new regions** - New AWS regions appear automatically
- ✅ **Single source of truth** - AWS API → Lambda → CloudFront → Frontend
- **Files affected**: `Regions.jsx`, `Coverage.jsx`, `Reports.jsx`, `ServiceDetailModal.jsx`
- **Benefit**: When AWS launches new regions, they appear with full names within 5 minutes (cache refresh)

---

**Last Updated**: October 24, 2025
**Version**: 2.1.0
**Status**: ✅ Production
