import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import '@/styles/new/application.css';
import { AuthenticationContextType } from '@/services/Authentication';

const Root = () => (
  <>
    <Outlet />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRouteWithContext<{ auth: AuthenticationContextType }>()({
  component: Root,
});
