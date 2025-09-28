import { createFileRoute } from '@tanstack/react-router';
import { Signage } from '@/components/pages/Signage';

export const Route = createFileRoute('/signage')({
  component: () => <Signage />,
});
