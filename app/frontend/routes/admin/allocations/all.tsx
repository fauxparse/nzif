import { Everybody } from '@/components/pages/admin/Allocations/Everybody';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/allocations/all')({
  component: Everybody,
});
