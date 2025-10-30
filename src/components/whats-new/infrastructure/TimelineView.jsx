import { useMemo } from 'react';
import DateHeader from './DateHeader';
import ChangeCard from './ChangeCard';

function TimelineView({ changeLog, searchQuery, servicesData }) {
  const filteredChanges = useMemo(() => {
    if (!searchQuery) return changeLog;

    const query = searchQuery.toLowerCase();
    return changeLog.filter((entry) => {
      const dateMatch = entry.date.toLowerCase().includes(query);
      const summaryMatch = entry.summary.toLowerCase().includes(query);
      const servicesMatch = entry.changes.newServices?.some((s) =>
        s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query)
      );
      return dateMatch || summaryMatch || servicesMatch;
    });
  }, [changeLog, searchQuery]);

  if (filteredChanges.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">
          {searchQuery ? '🔍' : '📦'}
        </div>
        <p className="text-text-light-secondary dark:text-text-secondary">
          {searchQuery
            ? 'No infrastructure changes match your search'
            : 'No infrastructure changes yet. Check back soon!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredChanges.map((entry) => (
        <div key={entry.date}>
          <DateHeader date={entry.date} />
          <ChangeCard entry={entry} servicesData={servicesData} />
        </div>
      ))}
    </div>
  );
}

export default TimelineView;
