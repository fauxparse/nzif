import { ActivityCardActivity } from '@/components/molecules/ActivityCard';
import { ActivityList } from '@/components/organisms/ActivityList';
import { ActivitiesQuery } from '@/components/organisms/ActivityList/queries';
import { useDummyActivities } from '@/components/organisms/ActivityList/useDummyActivities';
import { ActivityType } from '@/graphql/types';
import { useQuery } from '@apollo/client';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

export const Component: React.FC<{ activityType: ActivityType }> = ({ activityType }) => {
  const { festival } = Route.useRouteContext();

  const dummyActivities = useDummyActivities(festival, activityType);

  const { loading, data } = useQuery(ActivitiesQuery, {
    variables: { activityType },
  });

  const activities = useMemo<ActivityCardActivity[]>(() => {
    if (loading || !data) return dummyActivities;
    return data.festival.activities as ActivityCardActivity[];
  }, [loading, data]);

  return <ActivityList type={activityType} loading={loading} activities={activities} />;
};

export const Route = createFileRoute('/_public/$activityType/_list/')({});
