import { client } from '@/graphql';
import { AuthenticationContext, AuthenticationProvider } from '@/services/Authentication';
import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@formatjs/intl-numberformat/locale-data/en';
import '@formatjs/intl-numberformat/polyfill';
import { Toast } from '@/components/molecules/Toast';
import { ConfirmationModalProvider } from '@/components/organisms/ConfirmationModal';
import { router } from '@/router';
import { PricingProvider } from '@/services/Pricing';
import { ThemeProvider } from '@/services/Themes';
import { RouterProvider } from '@tanstack/react-router';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Settings as LuxonSettings } from 'luxon';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import '@radix-ui/themes/styles.css';
import '@/styles/new/application.css';

const queryClient = new QueryClient();

LuxonSettings.defaultZone = 'Pacific/Auckland';
dayjs.extend(customParseFormat);

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <Helmet>
        <title>NZIF: New Zealand Improv Festival</title>
      </Helmet>
      <ThemeProvider>
        <ConfirmationModalProvider>
          <Toast.Provider>
            <ApolloProvider client={client}>
              <QueryClientProvider client={queryClient}>
                <PricingProvider>
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
                </PricingProvider>
              </QueryClientProvider>
            </ApolloProvider>
          </Toast.Provider>
        </ConfirmationModalProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);
