import { useMemo } from 'react';
import DateHeader from './DateHeader';
import ChangeCard from './ChangeCard';
import { parseSearchTerms, matchesAnyTerm } from '../../../utils/searchUtils';

function TimelineView({ changeLog, searchQuery, servicesData }) {
  const filteredChanges = useMemo(() => {
    const terms = parseSearchTerms(searchQuery);
    if (terms.length === 0) return changeLog;

    return changeLog.filter((entry) => {
      const dateMatch = matchesAnyTerm(entry.date, terms);
      const summaryMatch = matchesAnyTerm(entry.summary, terms);
      const servicesMatch = entry.changes.newServices?.some((s) =>
        matchesAnyTerm(s.name, terms) || matchesAnyTerm(s.code, terms)
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
