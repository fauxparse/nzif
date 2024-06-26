import { Profile } from '@/components/pages/Profile';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/_authenticated/profile')({
  component: Profile,
});
