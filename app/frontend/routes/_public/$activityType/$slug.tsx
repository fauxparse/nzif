import ActivityDetails, { ActivityDetailsQuery } from '@/components/pages/ActivityDetails';
import { ResultOf } from '@/graphql';
import { ActivityType } from '@/graphql/types';
import { createFileRoute, notFound } from '@tanstack/react-router';

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
  loader: async ({ params: { activityType, slug }, context }) => {
    const { client, year } = context;

    const activity = await client
      .query({
        query: ActivityDetailsQuery,
        variables: {
          year,
          type: activityType as ActivityType,
          slug,
        },
      })
      .then(({ data }) => data.festival.activity);

    if (!activity) throw notFound();

    return { activity };
  },
  component: Component,
  pendingComponent: ({ params: { activityType } }) => (
    <ActivityDetails
      activity={{
        id: 'loading',
        name: 'Loading…',
        sessions: [],
        presenters: [],
        picture: null,
        description: '',
        type: activityType,
        bookingLink: null,
      }}
      loading
    />
  ),
});
