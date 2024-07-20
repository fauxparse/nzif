import { JumpTo } from '@/components/molecules/VenueMap';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/venues/$id')({
  component: () => {
    const { id } = Route.useParams();
    return <JumpTo venueId={id} />;
  },
});
