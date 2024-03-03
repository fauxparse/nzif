import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import Logo from '@/components/atoms/Logo';

import './_auth/_auth.css';

type AuthSearch = {
  redirect?: string;
};

const Authentication = () => (
  <div className="authentication">
    <div className="container">
      <Outlet />
    </div>
  </div>
);

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
