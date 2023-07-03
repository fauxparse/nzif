import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import { useAuthentication } from '@/organisms/Authentication';
import Header from '@/organisms/Header';

import CurrentFestivalRedirect from './CurrentFestivalRedirect';
import Festival from './Festival';

import './Admin.css';

const Admin: React.FC = () => {
  const { loading, user } = useAuthentication();

  if (!loading && !user?.permissions.length) {
    return <Navigate to="/" />;
  }

  return (
    <BreadcrumbProvider label="Admin" path="admin">
      <div>
        <Header />
        <Routes>
          <Route path=":year/*" element={<Festival />} />
          <Route index element={<CurrentFestivalRedirect />} />
        </Routes>
      </div>
    </BreadcrumbProvider>
  );
};

export default Admin;
