import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/register/workshops')({
  component: () => <div>Hello /_public/register/workshops!</div>,
});
