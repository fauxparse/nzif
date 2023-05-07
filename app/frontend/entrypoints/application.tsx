import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { Settings } from 'luxon';

import App from '../App';
import { client } from '../graphql';

import './application.css';
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
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
