import React from 'react';
import { createRoot } from 'react-dom/client';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ApolloProvider } from '@apollo/client';
import { Settings } from 'luxon';

import App from '../App';
import { client } from '../graphql';
import Toaster from '@/molecules/Toaster';

import './application.css';

import '@formatjs/intl-numberformat/polyfill';
import '@formatjs/intl-numberformat/locale-data/en';

// import 'virtual:fonts.css';

// Example: Load Rails libraries in Vite.
//
// import ActiveStorage from '@rails/activestorage'
// ActiveStorage.start()
//
// // Import all channels.
// const channels = import.meta.globEager('./**/*_channel.js')

Settings.defaultZone = 'Pacific/Auckland';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <Helmet>
        <title>NZIF: New Zealand Improv Festival 2023</title>
      </Helmet>
      <ApolloProvider client={client}>
        <Toaster>
          <App />
        </Toaster>
      </ApolloProvider>
    </HelmetProvider>
  </React.StrictMode>
);
