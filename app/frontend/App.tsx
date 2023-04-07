import React from 'react';

import PlacenameProvider from './atoms/Placename/PlacenameProvider';
import AuthenticationProvider from './organisms/Authentication/AuthenticationProvider';
import Footer from './organisms/Footer';
import Header from './organisms/Header';

const App: React.FC = () => {
  return (
    <AuthenticationProvider>
      <PlacenameProvider>
        <div className="app">
          <Header />
          <main></main>
          <Footer />
        </div>
      </PlacenameProvider>
    </AuthenticationProvider>
  );
};

export default App;
