import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/_authenticated/my/$activityType/$slug/$sessionId')({
  component: () => {
    const { sessionId, activityType } = Route.useParams();

    return null;
  },
});
