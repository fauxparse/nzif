import { Permission } from '@/graphql/types';
import { RequirePermission } from '@/routes/admin';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/registrations')({
  component: () => {
    return (
      <RequirePermission permission={Permission.Registrations}>
        <Outlet />
      </RequirePermission>
    );
  },
  beforeLoad: ({ params }) => ({
    getTitle: () => 'Registrations',
  }),
});
