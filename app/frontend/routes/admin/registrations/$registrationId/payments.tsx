import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/registrations/$registrationId/payments')({
  component: () => {
    return <b>c</b>;
  },
});
