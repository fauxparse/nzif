import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useNavigate } from 'react-router-dom';

import { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import { useAuthentication } from '@/organisms/Authentication';
import Header from '@/organisms/Header';

import './Admin.css';

export const Component: React.FC = () => {
  const { loading, user } = useAuthentication();

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user?.permissions.length) {
      navigate('/');
    }
  }, [loading, user, navigate]);

  return (
    <BreadcrumbProvider label="Admin" path="admin">
      <Helmet>
        <title>NZIF Admin</title>
      </Helmet>
      {!loading && user?.permissions?.length && (
        <div className="admin">
          <Header />
          <Outlet />
        </div>
      )}
    </BreadcrumbProvider>
  );
};

Component.displayName = 'Admin';

export default Component;
