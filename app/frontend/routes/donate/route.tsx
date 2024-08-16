import Layout from '@/components/pages/Donate/Layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/donate')({
  component: Layout,
});
