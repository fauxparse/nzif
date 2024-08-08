import Header from '@/components/organisms/Header';
import { RegistrationsList } from '@/components/organisms/RegistrationsList';
import { Permission } from '@/graphql/types';
import BarChartIcon from '@/icons/BarChartIcon';
import { RequirePermission } from '@/routes/admin';
import { IconButton } from '@radix-ui/themes';
import { Link, Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/registrations')({
  component: () => {
    return (
      <RequirePermission permission={Permission.Registrations}>
        <Header
          title="Registrations"
          actions={
            <IconButton asChild variant="ghost" radius="full" size="3">
              <Link to="/admin/registrations/preferences" replace>
                <BarChartIcon />
              </Link>
            </IconButton>
          }
        />

        <RegistrationsList />
        <Outlet />
      </RequirePermission>
    );
  },
});
