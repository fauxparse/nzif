import { Messages } from '@/components/pages/MyActivities/Workshop/Messages';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_public/_authenticated/my/workshops/$slug/$sessionId/messages'
)({
  component: Messages,
});
