import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/people')({
  beforeLoad: () => ({ getTitle: () => 'People' }),
  notFoundComponent: () => <div>parent error</div>,
});
