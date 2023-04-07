import React from 'react';

import PlacenameProvider from './atoms/Placename/PlacenameProvider';
import AuthenticationProvider from './organisms/Authentication/AuthenticationProvider';
import Header from './organisms/Header';

const App: React.FC = () => {
  return (
    <AuthenticationProvider>
      <PlacenameProvider>
        <div className="app">
          <Header />
        </div>
      </PlacenameProvider>
    </AuthenticationProvider>
  );
};

export default App;
