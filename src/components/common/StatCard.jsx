import { Link } from 'react-router-dom';
import { formatNumber } from '../../utils/formatters';

function StatCard({ title, value, description, icon, trend, to }) {
  const content = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-text-secondary text-sm font-medium uppercase tracking-wide">
          {title}
        </h3>
        {icon && (
          <div className="text-primary">
            {icon}
          </div>
        )}
      </div>

      <div className="mb-2">
        <div className="text-4xl font-bold text-text-primary">
          {typeof value === 'number' ? formatNumber(value) : value}
        </div>
      </div>

      {description && (
        <p className="text-text-secondary text-sm">
          {description}
        </p>
      )}

      {trend && (
        <div className="mt-4 flex items-center text-sm">
          {trend.direction === 'up' && (
            <svg className="w-4 h-4 text-status-success mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          )}
          {trend.direction === 'down' && (
            <svg className="w-4 h-4 text-status-error mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          <span className={trend.direction === 'up' ? 'text-status-success' : 'text-status-error'}>
            {trend.value}
          </span>
          <span className="text-text-secondary ml-2">{trend.label}</span>
        </div>
      )}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="block bg-bg-secondary rounded-lg p-6 border border-border hover:border-primary transition-colors cursor-pointer group"
      >
        {content}
        <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <span>View details</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-bg-secondary rounded-lg p-6 border border-border hover:border-primary transition-colors">
      {content}
    </div>
  );
}

export default StatCard;
