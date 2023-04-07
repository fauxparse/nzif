import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Contentful from './pages/Contentful';
import Public from './pages/public';
import Home from './pages/Public/Home';

const Routing: React.FC = () => (
  <Routes>
    <Route path="/" element={<Public />}>
      <Route path="/" element={<Home />} />
      <Route path=":slug" element={<Contentful />} />
    </Route>
  </Routes>
);

export default Routing;
