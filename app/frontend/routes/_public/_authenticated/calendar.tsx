import { Calendar } from '@/components/pages/Calendar';
import { CalendarQuery } from '@/components/pages/Calendar/queries';
import { CalendarSession } from '@/components/pages/Calendar/types';
import { createFileRoute, notFound } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/_authenticated/calendar')({
  component: () => {
    const { calendar } = Route.useLoaderData();
    return <Calendar sessions={calendar} />;
  },
  pendingComponent: () => <Calendar loading sessions={[]} />,
  loader: async ({ context }) => {
    const { client, year } = context;

    const calendar = await client
      .query({
        query: CalendarQuery,
      })
      .then(({ data }) => data.calendar as CalendarSession[]);

    if (!calendar) throw notFound();

    return { calendar };
  },
});
