import { createFileRoute, Outlet } from '@tanstack/react-router';

import './_auth/_auth.css';
import { pick } from 'lodash-es';
import Logo from '@/components/Logo';

type AuthSearch = {
  redirect?: string;
};

const Authentication = () => (
  <div className="authentication">
    <div className="container">
      <Logo />
      <Outlet />
    </div>
  </div>
);

export const Route = createFileRoute('/_auth')({
  component: Authentication,
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    redirect: search.redirect as string | undefined,
  }),
});
