import { Form } from '@/components/pages/Donate/Form';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/donate/')({
  component: Form,
});
