import { Yourself } from '@/components/pages/Registration/Yourself';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/register/yourself')({
  component: Yourself,
});
