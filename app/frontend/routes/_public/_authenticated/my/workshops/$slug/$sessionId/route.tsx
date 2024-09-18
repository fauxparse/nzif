import { Workshop } from '@/components/pages/MyActivities/Workshop';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/_authenticated/my/workshops/$slug/$sessionId')({
  component: () => {
    const { slug, sessionId } = Route.useParams();
    return <Workshop slug={slug} sessionId={sessionId} />;
  },
});
