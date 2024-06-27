import { Edit } from '@/components/pages/admin/ActivityEditor/Edit';
import { ActivityDetailsQuery } from '@/components/pages/admin/ActivityEditor/queries';
import useFestival from '@/hooks/useFestival';
import { useQuery } from '@apollo/client';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/$activityType/$slug/')({
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

    if (loading || !activity) return null;

    return <Edit activity={activity} />;
  },
});
