import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { PortalManager } from '@chakra-ui/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import PlacenameProvider from './atoms/Placename/PlacenameProvider';
import AuthenticationProvider from './organisms/Authentication/AuthenticationProvider';
import Routes from './Routes';

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <PortalManager>
      <AuthenticationProvider>
        <PlacenameProvider>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </PlacenameProvider>
      </AuthenticationProvider>
    </PortalManager>
  </QueryClientProvider>
);

export default App;
