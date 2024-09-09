import { RouteTransition } from '@/components/helpers/RouteTransition';
import { Permission } from '@/graphql/types';
import { RequirePermission } from '@/routes/admin';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/registrations')({
  component: () => {
    return (
      <RequirePermission permission={Permission.Registrations}>
        <RouteTransition />
      </RequirePermission>
    );
  },
  beforeLoad: ({ params }) => ({
    getTitle: () => 'Registrations',
  }),
});
