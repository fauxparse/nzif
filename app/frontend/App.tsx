import { PortalManager } from '@chakra-ui/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import rg4js from 'raygun4js';
import React from 'react';

import Routes from './Routes';
import PlacenameProvider from './atoms/Placename/PlacenameProvider';
import AuthenticationProvider from './organisms/Authentication/AuthenticationProvider';

const queryClient = new QueryClient();

rg4js('apiKey', '506C6CapQPSWt8QaeAfw');
rg4js('enableCrashReporting', import.meta.env.PROD);

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <PortalManager>
      <AuthenticationProvider key="auth">
        <PlacenameProvider>
          <Routes />
        </PlacenameProvider>
      </AuthenticationProvider>
    </PortalManager>
  </QueryClientProvider>
);

export default App;
