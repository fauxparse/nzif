import { ApolloProvider } from '@apollo/client';
import { Settings } from 'luxon';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { client } from '../graphql';

import '@formatjs/intl-numberformat/locale-data/en';
import '@formatjs/intl-numberformat/polyfill';

import { RouterProvider, createRouter } from '@tanstack/react-router';

// Import the generated route tree
import { routeTree } from '../routeTree.gen';

Settings.defaultZone = 'Pacific/Auckland';

// Create a new router instance
const router = createRouter({ routeTree });

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
        <title>NZIF: New Zealand Improv Festival 2023</title>
      </Helmet>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </HelmetProvider>
  </React.StrictMode>
);
