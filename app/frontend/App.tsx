import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PlacenameProvider from './atoms/Placename/PlacenameProvider';
import AuthenticationProvider from './organisms/Authentication/AuthenticationProvider';
import Contentful from './pages/Contentful';
import Public from './pages/public';
import Home from './pages/Public/Home';

const App: React.FC = () => (
  <AuthenticationProvider>
    <PlacenameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Public />}>
            <Route path="/" element={<Home />} />
            <Route path=":slug" element={<Contentful />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PlacenameProvider>
  </AuthenticationProvider>
);

export default App;
