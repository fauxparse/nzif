import { Thanks } from '@/components/pages/Donate/Thanks';
import { Navigate, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

export const Route = createFileRoute('/donate/thanks')({
  validateSearch: z.object({ payment_intent: z.string() }),
  component: Thanks,
  errorComponent: () => <Navigate to="/donate" />,
});
