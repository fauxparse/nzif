import { ApolloProvider } from '@apollo/client';
import { Settings } from 'luxon';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import Directory from '@/directory';
import { client } from '../graphql';

import './application.css';

import '@formatjs/intl-numberformat/locale-data/en';
import '@formatjs/intl-numberformat/polyfill';

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
