import { Home } from '@/directory/Home';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/directory/')({
  component: Home,
});
