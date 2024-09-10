import { Payments } from '@/components/pages/admin/Registrations/Details/Payments';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/registrations/$registrationId/payments')({
  component: Payments,
});
