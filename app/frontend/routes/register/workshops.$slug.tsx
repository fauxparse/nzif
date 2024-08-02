import { Workshops } from '@/components/pages/Registration/Workshops';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/register/workshops/$slug')({
  component: Workshops,
});
