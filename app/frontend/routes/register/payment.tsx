import { Payment } from '@/components/pages/Registration/Payment';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/register/payment')({
  component: Payment,
  beforeLoad: ({ location, context }) => {
    if (context.auth.user === null) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
        replace: true,
      });
    }
  },
});
