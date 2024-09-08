import { PaymentsList } from '@/components/pages/admin/Payments/PaymentsList';
import { Permission } from '@/graphql/types';
import { RequirePermission } from '@/routes/admin';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/payments')({
  component: () => {
    return (
      <RequirePermission permission={Permission.Admin}>
        <PaymentsList />
        <Outlet />
      </RequirePermission>
    );
  },
});
