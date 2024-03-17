import { Await, createFileRoute, defer, useMatch } from '@tanstack/react-router';
import { graphql, readFragment } from '@/graphql';
import { ACTIVITY_TYPES } from '@/constants/activityTypes';
import type { PluralActivityType } from '@/constants/activityTypes';
import type { ActivityCardActivity } from '@/components/organisms/ActivityList/ActivityCard';
import { ActivityCardFragment } from '@/components/organisms/ActivityList/ActivityCard';

import './$activityType.css';
import ActivityList from '@/components/organisms/ActivityList';
import { Suspense } from 'react';
import type { ActivityType } from '@/graphql/types';
import type { CurrentFestival } from '@/hooks/useFestival';
import { range, uniqueId } from 'lodash-es';

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

const useDummyActivities = (festival: CurrentFestival, type: ActivityType) => {
  const days = range(festival.endDate.diff(festival.startDate, 'days').as('days') + 1).map((i) =>
    festival.startDate.plus({ days: i })
  );
  return days.flatMap((date): ActivityCardActivity[] =>
    range(3).map(() => {
      const id = uniqueId();
      return {
        id,
        slug: id,
        name: 'Loading...',
        description: '',
        type,
        sessions: [
          {
            id,
            startsAt: date,
            endsAt: date,
          },
        ],
        presenters: [],
        picture: null,
      };
    })
  );
};

const LoadingState = () => {
  const { festival } = Route.useRouteContext();

  const { activityType: plural } = useMatch({ from: '/_public/$activityType/_list/' }).params;

  const type = ACTIVITY_TYPES[plural as PluralActivityType].type;

  const dummyActivities = useDummyActivities(festival, type);

  return <ActivityList loading type={type} activities={dummyActivities} />;
};

const Component = () => {
  const { activities } = Route.useLoaderData();

  const { activityType: plural } = useMatch({ from: '/_public/$activityType/_list/' }).params;

  const type = ACTIVITY_TYPES[plural as PluralActivityType].type;

  return (
    <Suspense fallback={<LoadingState />}>
      <Await promise={activities}>{(data) => <ActivityList type={type} activities={data} />}</Await>
    </Suspense>
  );
};

export const Route = createFileRoute('/_public/$activityType/_list/')({
  component: Component,
  loader: async ({ params, context }) => {
    const plural = params.activityType as PluralActivityType;
    const activityType = ACTIVITY_TYPES[plural].type;

    const activities = context.client
      .query({ query: ActivitiesQuery, variables: { activityType } })
      .then(
        ({ data }) =>
          readFragment(ActivityCardFragment, data.festival.activities) as ActivityCardActivity[]
      );

    return { activities: defer(activities) };
  },
  pendingComponent: LoadingState,
});