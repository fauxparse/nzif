import React from 'react';
import { Outlet } from 'react-router-dom';

import Footer from '../../organisms/Footer';
import Header from '../../organisms/Header';

import './Public.css';

const Public: React.FC = () => (
  <div className="app">
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Public;
