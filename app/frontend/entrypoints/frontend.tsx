import { client } from '@/graphql';
import { AuthenticationContext, AuthenticationProvider } from '@/services/Authentication';
import { ApolloProvider } from '@apollo/client';
import '@formatjs/intl-numberformat/locale-data/en';
import '@formatjs/intl-numberformat/polyfill';
import { ConfirmationModalProvider } from '@/components/organisms/ConfirmationModal';
import { ThemeProvider } from '@/services/Themes';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { RouterProvider } from '@tanstack/react-router';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Settings as LuxonSettings } from 'luxon';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import '@radix-ui/themes/styles.css';
import '@/styles/new/application.css';
import { RealRouterContext, router } from '@/router';

LuxonSettings.defaultZone = 'Pacific/Auckland';
dayjs.extend(customParseFormat);

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
                    <RealRouterContext.Provider value={{ realRouter: true }}>
                      <RouterProvider
                        router={router}
                        context={{
                          auth: { ...auth },
                          client,
                        }}
                      />
                    </RealRouterContext.Provider>
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
