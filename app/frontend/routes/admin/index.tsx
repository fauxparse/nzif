import { Dashboard } from '@/components/pages/admin/Dashboard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/')({
  component: Dashboard,
});
