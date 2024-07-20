import { JumpTo } from '@/components/molecules/VenueMap';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/venues/')({
  component: () => <JumpTo venueId={null} />,
});
