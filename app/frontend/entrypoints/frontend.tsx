import { RouterContext } from '@/RouterContext';
import { client } from '@/graphql';
import { CurrentFestival } from '@/hooks/useFestival';
import { AuthenticationContext, AuthenticationProvider } from '@/services/Authentication';
import { AuthenticationContextType } from '@/services/Authentication';
import { ApolloProvider } from '@apollo/client';
import '@formatjs/intl-numberformat/locale-data/en';
import '@formatjs/intl-numberformat/polyfill';
import { ConfirmationModalProvider } from '@/components/organisms/ConfirmationModal';
import { routeTree } from '@/routeTree.gen';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Settings as LuxonSettings } from 'luxon';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import '@radix-ui/themes/styles.css';
import '@/styles/new/application.css';
import { ThemeProvider } from '@/services/Themes';

LuxonSettings.defaultZone = 'Pacific/Auckland';
dayjs.extend(customParseFormat);

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
      <ThemeProvider>
        <MantineProvider>
          <ConfirmationModalProvider>
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
          </ConfirmationModalProvider>
        </MantineProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);
