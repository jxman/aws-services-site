import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import { usePageMeta } from '../hooks/usePageMeta';
import { NOT_FOUND_META } from '../utils/seo';

function NotFound() {
  usePageMeta(NOT_FOUND_META);

  return (
    <Container>
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-text-light-primary dark:text-text-primary mb-4">Page not found</h1>
        <p className="text-text-light-secondary dark:text-text-secondary text-lg mb-8">
          The page you were looking for does not exist.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
            Go to dashboard
          </Link>
          <Link to="/regions" className="px-4 py-2 text-primary hover:text-primary-light">
            Browse regions
          </Link>
          <Link to="/services" className="px-4 py-2 text-primary hover:text-primary-light">
            Browse services
          </Link>
        </div>
      </div>
    </Container>
  );
}

export default NotFound;
