import { Workshops } from '@/components/pages/admin/Registrations/Details/Workshops';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/registrations/$registrationId/workshops')({
  component: Workshops,
});
