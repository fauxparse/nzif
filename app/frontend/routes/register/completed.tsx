import { Completed } from '@/components/pages/Registration/Completed';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/register/completed')({
  component: Completed,
});
