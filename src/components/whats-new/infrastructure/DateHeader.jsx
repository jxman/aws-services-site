import { format } from 'date-fns';

function DateHeader({ date }) {
  const formattedDate = format(new Date(date), 'MMM dd, yyyy');

  return (
    <div className="py-2 mb-2">
      <div className="text-xs font-semibold text-text-light-secondary dark:text-text-secondary uppercase tracking-wider">
        {formattedDate}
      </div>
    </div>
  );
}

export default DateHeader;
