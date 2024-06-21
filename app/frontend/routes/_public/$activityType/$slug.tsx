import { ActivityDetails } from '@/components/pages/ActivityDetails';
import { ActivityDetailsQuery } from '@/components/pages/ActivityDetails/queries';
import { useQuery } from '@apollo/client';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

export const Route = createFileRoute('/_public/$activityType/$slug')({
  component: () => {
    const { festival } = Route.useRouteContext();
    const { activityType, slug } = Route.useParams();
    const { loading, data } = useQuery(ActivityDetailsQuery, {
      variables: { year: festival.id, type: activityType, slug },
    });

    const activity = useMemo(
      () =>
        data?.festival.activity || {
          id: 'loading',
          name: 'Loading…',
          sessions: [],
          presenters: [],
          picture: null,
          description: '',
          type: activityType,
          bookingLink: null,
        },
      [loading, data]
    );

    return <ActivityDetails activity={activity} loading={loading} />;
  },
});
