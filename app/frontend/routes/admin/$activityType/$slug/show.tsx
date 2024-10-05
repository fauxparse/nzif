import { Show } from '@/components/pages/admin/ActivityEditor/Show';
import { ActivityDetailsQuery } from '@/components/pages/admin/ActivityEditor/queries';
import { useFestival } from '@/hooks/useFestival';
import { useQuery } from '@apollo/client';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/$activityType/$slug/show')({
  component: () => {
    const { activityType, slug } = Route.useParams();

    const festival = useFestival();

    const { loading, data } = useQuery(ActivityDetailsQuery, {
      variables: {
        year: festival.id,
        type: activityType,
        slug,
      },
    });
    const activity = data?.festival?.activity;

    if (loading || !activity || !('show' in activity) || !activity.show) return null;

    return <Show show={activity.show} />;
  },
});
