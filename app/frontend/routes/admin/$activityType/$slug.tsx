import { ActivityDetailsQuery } from '@/components/pages/ActivityDetails';
import { PluralActivityType, getActivityTypeFromPlural } from '@/constants/activityTypes';
import { ResultOf } from '@/graphql';
import { Text } from '@mantine/core';
import { createFileRoute, notFound } from '@tanstack/react-router';

const Component = () => {
  const { activity } = Route.useLoaderData();

  return <Text>{activity.name}</Text>;
};

export const Route = createFileRoute('/admin/$activityType/$slug')({
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
  pendingComponent: ({ params }) => <Text>Loading…</Text>,
});
