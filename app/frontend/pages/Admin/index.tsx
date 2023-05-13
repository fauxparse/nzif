import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import Header from '@/organisms/Header';

import Festival from './Festival';

import './Admin.css';

const Admin: React.FC = () => {
  return (
    <BreadcrumbProvider label="Admin" path="admin">
      <div>
        <Header />
        <Routes>
          <Route path=":year/*" element={<Festival />} />
        </Routes>
      </div>
    </BreadcrumbProvider>
  );
};

export default Admin;
