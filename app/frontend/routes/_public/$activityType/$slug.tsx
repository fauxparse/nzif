import { Await, createFileRoute, defer, notFound } from '@tanstack/react-router';
import { ResultOf } from '@/graphql';
import { Suspense } from 'react';
import { PluralActivityType, getActivityTypeFromPlural } from '@/constants/activityTypes';
import ActivityDetails, { ActivityDetailsQuery } from '@/components/pages/ActivityDetails';

const Component = () => {
  const { activity } = Route.useLoaderData();

  return <ActivityDetails activity={activity} />;
};

export const Route = createFileRoute('/_public/$activityType/$slug')({
  beforeLoad: () => {
    return {
      getTitle: (activity: ResultOf<typeof ActivityDetailsQuery>['festival']['activity']) =>
        activity?.name,
    };
  },
  loader: async ({ params, context }) => {
    const { activityType, slug } = params;
    const { client, year } = context;

    const type = getActivityTypeFromPlural(activityType as PluralActivityType);

    const activity = await client
      .query({
        query: ActivityDetailsQuery,
        variables: {
          year,
          type,
          slug,
        },
      })
      .then(({ data }) => data.festival.activity);

    if (!activity) throw notFound();

    return { activity };
  },
  component: Component,
  pendingComponent: ({ params }) => (
    <ActivityDetails
      activity={{
        id: 'loading',
        name: 'Loading…',
        sessions: [],
        presenters: [],
        picture: null,
        description: '',
        type: getActivityTypeFromPlural(params.type),
        bookingLink: null,
      }}
      loading
    />
  ),
});
