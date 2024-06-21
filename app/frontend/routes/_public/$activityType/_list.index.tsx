import { ActivityList } from '@/components/organisms/ActivityList';
import { ActivityCardActivity } from '@/components/organisms/ActivityList/ActivityCard';
import { ActivitiesQuery, ActivityCardFragment } from '@/components/organisms/ActivityList/queries';
import { useDummyActivities } from '@/components/organisms/ActivityList/useDummyActivities';
import { readFragment } from '@/graphql';
import { useQuery } from '@apollo/client';
import { createFileRoute, useMatch } from '@tanstack/react-router';
import { useMemo } from 'react';

import './$activityType.css';

export const Route = createFileRoute('/_public/$activityType/_list/')({
  component: () => {
    const { festival } = Route.useRouteContext();

    const { activityType } = useMatch({ from: '/_public/$activityType/_list/' }).params;

    const dummyActivities = useDummyActivities(festival, activityType);

    const { loading, data } = useQuery(ActivitiesQuery, { variables: { activityType } });

    const activities = useMemo<ActivityCardActivity[]>(() => {
      if (loading || !data) return dummyActivities;
      return readFragment(ActivityCardFragment, data.festival.activities) as ActivityCardActivity[];
    }, [loading, data]);

    return <ActivityList type={activityType} loading={loading} activities={activities} />;
  },
});
