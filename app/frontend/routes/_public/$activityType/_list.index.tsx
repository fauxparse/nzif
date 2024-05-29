import type { ActivityCardActivity } from '@/components/organisms/ActivityList/ActivityCard';
import { ActivityCardFragment } from '@/components/organisms/ActivityList/ActivityCard';
import { activityTypeFromPlural } from '@/constants/activityTypes';
import type { PluralActivityType } from '@/constants/activityTypes';
import { graphql, readFragment } from '@/graphql';
import { createFileRoute, useMatch } from '@tanstack/react-router';

import ActivityList from '@/components/organisms/ActivityList';
import type { ActivityType } from '@/graphql/types';
import type { CurrentFestival } from '@/hooks/useFestival';
import { range, uniqueId } from 'lodash-es';
import './$activityType.css';

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

  const activityType = useMatch({ from: '/_public/$activityType/_list/' }).params
    .activityType as ActivityType;

  const dummyActivities = useDummyActivities(festival, activityType);

  return <ActivityList loading type={activityType} activities={dummyActivities} />;
};

const Component = () => {
  const activities = Route.useLoaderData();

  const { activityType: plural } = useMatch({ from: '/_public/$activityType/_list/' }).params;

  const type = activityTypeFromPlural(plural as PluralActivityType);

  return <ActivityList type={type} activities={activities} />;
};

export const Route = createFileRoute('/_public/$activityType/_list/')({
  component: Component,
  loader: async ({ params, context }) => {
    const activities = await context.client
      .query({
        query: ActivitiesQuery,
        variables: { activityType: params.activityType as ActivityType },
      })
      .then(
        ({ data }) =>
          readFragment(ActivityCardFragment, data.festival.activities) as ActivityCardActivity[]
      );

    return activities;
  },
  pendingMs: 100,
  pendingComponent: LoadingState,
});
