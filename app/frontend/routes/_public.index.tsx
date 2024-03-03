import { createFileRoute } from '@tanstack/react-router';
import { Home } from '@/components/pages/Home';

export const Route = createFileRoute('/_public/')({
  component: Home,
});
