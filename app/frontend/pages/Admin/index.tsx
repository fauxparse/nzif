import React from 'react';
import { Outlet } from 'react-router-dom';

import Footer from '../../organisms/Footer';
import Header from '../../organisms/Header';

const Admin: React.FC = () => (
  <div className="app">
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Admin;
