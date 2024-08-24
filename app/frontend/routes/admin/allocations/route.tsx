import { Allocations } from '@/components/pages/admin/Allocations';
import { Permission } from '@/graphql/types';
import { RequirePermission } from '@/routes/admin';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/allocations')({
  component: () => (
    <RequirePermission permission={Permission.Activities}>
      <Allocations />
    </RequirePermission>
  ),
});
