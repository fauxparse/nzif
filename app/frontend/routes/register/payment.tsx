import { Payment } from '@/components/pages/Registration/Payment';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/register/payment')({
  component: Payment,
});
