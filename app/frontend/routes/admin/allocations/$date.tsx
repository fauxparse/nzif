import { createFileRoute } from '@tanstack/react-router';
import { DateTime } from 'luxon';
import { Day } from '../../../components/pages/admin/Allocations/Day';

export const Route = createFileRoute('/admin/allocations/$date')({
  component: () => {
    const { date } = Route.useParams();
    return <Day date={date} />;
  },
  parseParams: ({ date }) => {
    return { date: DateTime.fromISO(date) };
  },
  stringifyParams: ({ date }) => ({
    date: date.toISODate() || '',
  }),
});
