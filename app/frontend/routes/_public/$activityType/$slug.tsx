import { ActivityDetails } from '@/components/pages/ActivityDetails';
import { ActivityDetailsQuery } from '@/components/pages/ActivityDetails/queries';
import { RegistrationProvider } from '@/services/Registration';
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
          slug: 'loading',
          sessions: [],
          presenters: [],
          picture: null,
          description: '',
          tagline: null,
          quotes: null,
          type: activityType,
          bookingLink: null,
          suitability: null,
        },
      [loading, data]
    );

    return (
      <RegistrationProvider>
        <ActivityDetails activity={activity} loading={loading} />
      </RegistrationProvider>
    );
  },
});
