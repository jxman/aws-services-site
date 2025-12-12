import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { usePageTracking } from './hooks/usePageTracking';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/common/ScrollToTop';
import CanonicalTag from './components/common/CanonicalTag';
import Dashboard from './views/Dashboard';
import About from './views/About';
import Regions from './views/Regions';
import Services from './views/Services';
import Coverage from './views/Coverage';
import Reports from './views/Reports';
import WhatsNew from './views/WhatsNew';

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      cacheTime: 30 * 60 * 1000,      // 30 minutes
      refetchOnWindowFocus: false,     // Don't refetch on tab focus
      refetchOnReconnect: true,        // Refetch on reconnect
      retry: 3,                        // Retry failed requests
    },
  },
});

// Internal component to use hooks that depend on Router context
function AppContent() {
  usePageTracking(); // Automatically track all page views

  return (
    <>
      <ScrollToTop />
      <CanonicalTag />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/regions" element={<Regions />} />
          <Route path="/services" element={<Services />} />
          <Route path="/coverage" element={<Coverage />} />
          <Route path="/whats-new" element={<WhatsNew />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
