import { RouterContext } from '@/RouterContext';
import { client } from '@/graphql';
import { CurrentFestival } from '@/hooks/useFestival';
import { AuthenticationContextType } from '@/services/Authentication';
import '@formatjs/intl-numberformat/locale-data/en';
import '@formatjs/intl-numberformat/polyfill';
import { routeTree } from '@/routeTree.gen';
import { createRouter } from '@tanstack/react-router';
import { createContext } from 'react';

// Create a new router instance
export const router = createRouter({
  routeTree,
  context: {
    auth: { user: null, loading: true } as AuthenticationContextType,
    client,
    festival: {} as CurrentFestival,
  } as RouterContext,
  // defaultPendingComponent: () => <>Loading…</>,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const RealRouterContext = createContext({ realRouter: false });
