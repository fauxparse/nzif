import { Participants } from '@/components/pages/MyActivities/Workshop/Participants';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/_authenticated/my/workshops/$slug/$sessionId/')({
  component: Participants,
});
