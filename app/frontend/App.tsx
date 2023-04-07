import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import PlacenameProvider from './atoms/Placename/PlacenameProvider';
import AuthenticationProvider from './organisms/Authentication/AuthenticationProvider';
import Routes from './Routes';

const App: React.FC = () => (
  <AuthenticationProvider>
    <PlacenameProvider>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </PlacenameProvider>
  </AuthenticationProvider>
);

export default App;
