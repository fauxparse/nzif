import { DonationsList } from '@/components/pages/admin/Donations/DonationsList';
import { Permission } from '@/graphql/types';
import { RequirePermission } from '@/routes/admin';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/donations')({
  component: () => {
    return (
      <RequirePermission permission={Permission.Admin}>
        <DonationsList />
        <Outlet />
      </RequirePermission>
    );
  },
});
