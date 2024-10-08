import { Feedback, FeedbackProps } from '@/components/pages/admin/ActivityEditor/Feedback';
import { ActivityDetailsQuery } from '@/components/pages/admin/ActivityEditor/queries';
import { ActivityType } from '@/graphql/types';
import { useFestival } from '@/hooks/useFestival';
import { useQuery } from '@apollo/client';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/$activityType/$slug/feedback')({
  component: () => {
    const festival = useFestival();
    const { activityType, slug } = Route.useParams();

    const { loading, data } = useQuery(ActivityDetailsQuery, {
      variables: { year: festival.id, type: activityType, slug },
    });

    const activity = data?.festival?.activity;

    if (loading || !activity || activity.type !== ActivityType.Workshop) return null;

    return <Feedback activity={activity as FeedbackProps['activity']} />;
  },
});
