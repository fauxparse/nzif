import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/_authenticated/profile')({
  component: () => <div>Hello /_authenticated/profile!</div>,
});
