import React from 'react';
import { createRoot } from 'react-dom/client';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ApolloProvider } from '@apollo/client';
import { Settings } from 'luxon';

import { client } from '../graphql';
import Directory from '@/directory';

import './application.css';

import '@formatjs/intl-numberformat/polyfill';
import '@formatjs/intl-numberformat/locale-data/en';

Settings.defaultZone = 'Pacific/Auckland';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <Helmet>
        <title>NZIF: New Zealand Improv Festival 2023</title>
      </Helmet>
      <ApolloProvider client={client}>
        <Directory />
      </ApolloProvider>
    </HelmetProvider>
  </React.StrictMode>
);
