import { Directory } from '@/directory';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/directory')({
  component: Directory,
});
