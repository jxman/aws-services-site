# Development Instructions

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Server will start at http://localhost:3000
```

---

## Development Commands

```bash
# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint
```

---

## How Data Fetching Works

### In Development
- Vite proxy forwards `/data/*` requests to `https://aws-services.synepho.com`
- Allows local development with real production data
- No need to download or maintain local data files
- TanStack Query caches data in memory (5-minute stale time)

### In Production
- `/data/*` requests served directly from CloudFront distribution
- Data cached at CloudFront edge locations (5-minute TTL)
- Updated daily at 2:00 AM UTC by aws-data-fetcher Lambda
- Global edge caching for fast access worldwide

### Available Data Endpoints

```
/data/complete-data.json    # Complete dataset (239 KB)
/data/regions.json          # Regions metadata (9.6 KB)
/data/services.json         # Services catalog (32 KB)
/data/service-names.json    # Service name mappings
```

---

## Testing Data Access

```bash
# Start dev server
npm run dev

# In another terminal, test the proxy
curl http://localhost:3000/data/complete-data.json | jq '.metadata'

# Should return:
# {
#   "version": "2.0",
#   "generatedAt": "2025-10-23T02:00:00Z",
#   "totalRegions": 38,
#   "totalServices": 394
# }
```

---

## Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── common/             # Shared components
│   │   ├── Loading.jsx     # Loading spinner
│   │   ├── ErrorMessage.jsx # Error display
│   │   ├── StatCard.jsx    # Dashboard stat cards
│   │   ├── ServiceDetailModal.jsx  # Service detail modal
│   │   └── RegionDetailModal.jsx   # Region detail modal
│   │
│   ├── layout/             # Layout components
│   │   ├── Header.jsx      # Site header and navigation
│   │   ├── Footer.jsx      # Site footer
│   │   └── Container.jsx   # Page container wrapper
│   │
│   └── news/               # News components (planned)
│       ├── LatestArticle.jsx
│       ├── ArticleCard.jsx
│       └── ArticleGrid.jsx
│
├── views/                  # Page-level components
│   ├── Dashboard.jsx       # Home page with metrics
│   ├── Regions.jsx         # Regions browsing
│   ├── Services.jsx        # Services catalog
│   ├── Coverage.jsx        # Service × Region matrix
│   ├── Reports.jsx         # Report center
│   └── About.jsx           # About and documentation
│
├── hooks/                  # Custom React hooks
│   └── useAWSData.js       # Data fetching and caching
│
├── utils/                  # Helper functions
│   ├── calculations.js     # Coverage calculations
│   ├── formatters.js       # Formatting utilities
│   └── constants.js        # Constants and region names
│
├── config/                 # Configuration
│   └── aws-config.js       # Data URLs and endpoints
│
├── styles/                 # Global styles
│   └── index.css           # Tailwind and custom CSS
│
├── App.jsx                 # Root component with routing
├── main.jsx                # Application entry point
└── vite.config.js          # Vite configuration
```

---

## Development Workflow

### Making Changes

1. **Edit Files**: Make changes in `src/`
2. **Hot Reload**: Changes appear instantly in browser
3. **Test Locally**: Verify functionality at http://localhost:3000
4. **Check Console**: Ensure no errors in browser console
5. **Lint**: Run `npm run lint` before committing

### Adding New Routes

```javascript
// src/App.jsx
import NewView from './views/NewView';

<Routes>
  {/* Existing routes */}
  <Route path="/new-route" element={<NewView />} />
</Routes>
```

### Adding Navigation Links

```javascript
// src/components/layout/Header.jsx
<Link to="/new-route" className="...">
  New Page
</Link>
```

### Adding New Data Hooks

```javascript
// src/hooks/useNewData.js
import { useQuery } from '@tanstack/react-query';

export const useNewData = () => {
  return useQuery({
    queryKey: ['new-data'],
    queryFn: async () => {
      const response = await fetch('/data/new-data.json');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

---

## Common Development Tasks

### Adding a New View

1. Create component in `src/views/NewView.jsx`
2. Add route in `src/App.jsx`
3. Add navigation link in `src/components/layout/Header.jsx`
4. Test locally
5. Deploy when ready

### Adding CSV Export

```javascript
const exportToCSV = () => {
  const headers = ['Column1', 'Column2'];
  const rows = data.map(item => [item.field1, item.field2]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `report-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
```

### Updating Styles

```javascript
// Use Tailwind utility classes
<div className="bg-bg-secondary border border-border rounded-lg p-6">
  {/* Content */}
</div>

// Custom colors defined in tailwind.config.js
colors: {
  primary: '#ff9900',
  'bg-primary': '#0f1419',
  'bg-secondary': '#1a1f2e',
  'text-primary': '#ffffff'
}
```

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or let Vite choose another port automatically
# It will try 3001, 3002, etc.
```

### "Failed to fetch data" Error

```bash
# 1. Check dev server is running
npm run dev

# 2. Verify proxy configuration
cat vite.config.js

# 3. Test production data is accessible
curl https://aws-services.synepho.com/data/complete-data.json

# 4. Restart dev server
# Stop with Ctrl+C, then:
npm run dev
```

### Build Errors

```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json dist .vite
npm install

# Rebuild
npm run build
```

### Linting Errors

```bash
# Run linter to see issues
npm run lint

# Auto-fix where possible
npm run lint -- --fix
```

### HMR Not Working

```bash
# Restart dev server
# Stop with Ctrl+C, then:
npm run dev

# If still not working, clear Vite cache
rm -rf .vite
npm run dev
```

---

## Performance Tips

### Optimizing Components

```javascript
// Use useMemo for expensive calculations
const sortedData = useMemo(
  () => data.sort((a, b) => b.count - a.count),
  [data]
);

// Use useCallback for event handlers
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### Lazy Loading Routes

```javascript
// src/App.jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./views/Dashboard'));
const Regions = lazy(() => import('./views/Regions'));

<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/regions" element={<Regions />} />
  </Routes>
</Suspense>
```

---

## Testing Checklist

Before deploying changes:
- [ ] Test all routes work correctly
- [ ] Check responsive design on mobile/tablet
- [ ] Verify data loads without errors
- [ ] Test all interactive features (search, filters, exports)
- [ ] Check browser console for errors
- [ ] Run linter (`npm run lint`)
- [ ] Build successfully (`npm run build`)
- [ ] Preview production build (`npm run preview`)

---

## Helpful VS Code Extensions

- **ES7+ React/Redux/React-Native snippets** - Component shortcuts
- **Tailwind CSS IntelliSense** - Class name autocomplete
- **ESLint** - Real-time linting
- **Prettier** - Code formatting
- **Auto Rename Tag** - Rename paired HTML tags
- **Path Intellisense** - Autocomplete file paths

---

## Quick Reference

### React Query Cache Times
```javascript
staleTime: 5 * 60 * 1000,  // 5 minutes - data considered fresh
cacheTime: 30 * 60 * 1000, // 30 minutes - cached in memory
```

### Tailwind Breakpoints
```
sm: 640px   // Mobile landscape / Small tablet
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large desktop
```

### Vite HMR
- Changes to `.jsx` files trigger instant updates
- Changes to `.css` files update without refresh
- Changes to config files require server restart

---

## Next Steps

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions and [README.md](./README.md) for complete project documentation.
