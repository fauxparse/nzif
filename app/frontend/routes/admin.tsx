import Navigation from '@/components/organisms/Navigation';
import { Permission } from '@/graphql/types';
import { useTitle } from '@/hooks/useRoutesWithTitles';
import { hasPermission, useAuthentication } from '@/services/Authentication';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { isEmpty } from 'lodash-es';
import { PropsWithChildren, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

import '@/styles/new/admin.css';

export const Route = createFileRoute('/admin')({
  component: () => {
    const title = useTitle();

    return (
      <div className="layout layout--admin">
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Navigation className="layout__navigation" />
        <Outlet />
      </div>
    );
  },
  beforeLoad: async ({ location, context }) => {
    if (isEmpty(context?.auth?.user?.permissions)) {
      throw redirect({
        to: '/login',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
        replace: true, // Necessary for the back button to work correctly
      });
    }
  },
  notFoundComponent: () => <h1>not found</h1>,
});

export const RequirePermission: React.FC<PropsWithChildren<{ permission: Permission }>> = ({
  permission,
  children,
}) => {
  const { user } = useAuthentication();

  const cleared = useMemo(() => hasPermission(permission, user), [permission, user]);

  if (!cleared) {
    return <div>Not allowed</div>;
  }

  return <>{children}</>;
};
