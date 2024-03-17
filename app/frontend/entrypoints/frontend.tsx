import { CurrentFestival } from '@/hooks/useFestival';
import { RouterContext } from '@/routes/__root';
import {
  AuthenticationContext,
  AuthenticationContextType,
  AuthenticationProvider,
} from '@/services/Authentication';
import { ApolloProvider } from '@apollo/client';
import '@formatjs/intl-numberformat/locale-data/en';
import '@formatjs/intl-numberformat/polyfill';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { Settings as LuxonSettings } from 'luxon';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { client } from '../graphql';

// Import the generated route tree
import { routeTree } from '../routeTree.gen';

import '@mantine/notifications/styles.css';

LuxonSettings.defaultZone = 'Pacific/Auckland';

// Create a new router instance
const router = createRouter({
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

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <Helmet>
        <title>NZIF: New Zealand Improv Festival</title>
      </Helmet>
      <MantineProvider>
        <Notifications />
        <ApolloProvider client={client}>
          <AuthenticationProvider>
            <AuthenticationContext.Consumer>
              {(auth) => (
                <RouterProvider
                  router={router}
                  context={{
                    auth: { ...auth },
                    client,
                  }}
                />
              )}
            </AuthenticationContext.Consumer>
          </AuthenticationProvider>
        </ApolloProvider>
      </MantineProvider>
    </HelmetProvider>
  </React.StrictMode>
);
