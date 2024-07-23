import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/logout')({
  beforeLoad: async ({ context }) => {
    await context.auth.logOut();
    throw redirect({
      to: '/',
      replace: true,
    });
  },
});
