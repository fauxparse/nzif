import { Authentication } from '@/components/layouts/Authentication';
import { createFileRoute, redirect } from '@tanstack/react-router';

type AuthSearch = {
  redirect?: string;
};

export const Route = createFileRoute('/_auth')({
  component: Authentication,
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    redirect: search.redirect as string | undefined,
  }),
  beforeLoad: async ({ context, search }) => {
    if (context.auth.user) {
      throw redirect({
        to: search.redirect || '/',
        replace: true,
      });
    }
  },
});
