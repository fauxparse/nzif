import { createFileRoute } from '@tanstack/react-router';
import { Home } from '@/routed/Home';

export const Route = createFileRoute('/_public/')({
  component: Home,
});
