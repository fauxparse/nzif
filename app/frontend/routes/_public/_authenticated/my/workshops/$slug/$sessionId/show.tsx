import { Show } from '@/components/pages/MyActivities/Workshop/Show';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/_authenticated/my/workshops/$slug/$sessionId/show')({
  component: Show,
});
