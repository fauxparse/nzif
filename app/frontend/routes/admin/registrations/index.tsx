import { RegistrationsList } from '@/components/pages/admin/Registrations/List';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/registrations/')({
  component: RegistrationsList,
});
