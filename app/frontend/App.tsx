import React from 'react';

import AuthenticationProvider from './organisms/Authentication/AuthenticationProvider';
import Header from './organisms/Header';

const App: React.FC = () => {
  return (
    <AuthenticationProvider>
      <div className="app">
        <Header />
      </div>
    </AuthenticationProvider>
  );
};

export default App;
