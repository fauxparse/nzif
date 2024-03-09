import { Await, DeferredPromise, createFileRoute, defer, useMatch } from '@tanstack/react-router';
import { ResultOf, graphql, readFragment } from '@/graphql';
import { ACTIVITY_TYPES, PluralActivityType } from '@/constants/activityTypes';
import {
  ActivityCardActivity,
  ActivityCardFragment,
} from '@/components/organisms/ActivityList/ActivityCard';

import './$activityType.css';
import ActivityList from '@/components/organisms/ActivityList';
import { Suspense } from 'react';
import { Container } from '@mantine/core';
import { ActivityType } from '@/graphql/types';

const ActivitiesQuery = graphql(
  `#graphql
  query Programme($activityType: ActivityType!) {
    festival {
      id

      activities(type: $activityType) {
        ...ActivityCard
      }
    }
  }
`,
  [ActivityCardFragment]
);

const Component = () => {
  const { activities } = Route.useLoaderData();

  const { activityType: plural } = useMatch({ from: '/_public/$activityType/_list/' }).params;

  const type = ACTIVITY_TYPES[plural as PluralActivityType].type;

  return (
    <Suspense fallback={<ActivityList type={type} activities={[]} />}>
      <Await promise={activities}>{(data) => <ActivityList type={type} activities={data} />}</Await>
    </Suspense>
  );
};

export const Route = createFileRoute('/_public/$activityType/_list/')({
  component: Component,
  staleTime: Infinity,
  loader: async ({ params, context }) => {
    const plural = params.activityType as PluralActivityType;
    const activityType = ACTIVITY_TYPES[plural].type;

    const activities = new Promise<ActivityCardActivity[]>((resolve) => {
      context.client
        .query({ query: ActivitiesQuery, variables: { activityType } })
        .then(({ data }) => resolve(readFragment(ActivityCardFragment, data.festival.activities)));
    });

    return { activities: defer(activities) };
  },
});
