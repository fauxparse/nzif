import React from 'react';
import { Outlet } from 'react-router-dom';

import Footer from '../../organisms/Footer';
import Header from '../../organisms/Header';

import './Admin.css';

const Admin: React.FC = () => (
  <div className="admin app">
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Admin;
