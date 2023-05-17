import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import PlacenameProvider from './atoms/Placename/PlacenameProvider';
import AuthenticationProvider from './organisms/Authentication/AuthenticationProvider';
import Routes from './Routes';

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthenticationProvider>
      <PlacenameProvider>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </PlacenameProvider>
    </AuthenticationProvider>
  </QueryClientProvider>
);

export default App;
