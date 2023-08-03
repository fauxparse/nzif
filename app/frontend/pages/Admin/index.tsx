import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Outlet } from 'react-router-dom';

import { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import { useAuthentication } from '@/organisms/Authentication';
import Header from '@/organisms/Header';

import './Admin.css';

export const Component: React.FC = () => {
  const { loading, user } = useAuthentication();

  if (!loading && !user?.permissions.length) {
    // TODO: Redirect to login page
    return <Navigate to="/" />;
  }

  return (
    <BreadcrumbProvider label="Admin" path="admin">
      <Helmet>
        <title>NZIF Admin</title>
      </Helmet>
      <div>
        <Header />
        <Outlet />
      </div>
    </BreadcrumbProvider>
  );
};

Component.displayName = 'Admin';

export default Component;
