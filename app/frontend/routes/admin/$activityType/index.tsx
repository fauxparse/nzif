import { ActivityList } from '@/components/pages/admin/ActivityList';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/$activityType/')({
  component: () => {
    const { activityType } = Route.useParams();
    return <ActivityList activityType={activityType} />;
  },
});
