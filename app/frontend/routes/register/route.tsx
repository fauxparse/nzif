import { Layout } from '@/components/pages/Registration/Layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/register')({
  component: Layout,
  beforeLoad: ({ context }) => ({
    getTitle: () => `Register for NZIF ${context.year}`,
  }),
});
