import { RegistrationDetails } from '@/components/pages/admin/Registrations/Details';
import { Permission } from '@/graphql/types';
import { RequirePermission } from '@/routes/admin';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/registrations/$registrationId')({
  component: () => {
    const { registrationId } = Route.useParams();

    return (
      <RequirePermission permission={Permission.Registrations}>
        <RegistrationDetails id={registrationId} />
      </RequirePermission>
    );
  },
});
