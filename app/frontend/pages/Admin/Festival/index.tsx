import React from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { BreadcrumbProvider } from '@/molecules/Breadcrumbs';

const Festival: React.FC = () => {
  const { year } = useParams<{ year: string }>();

  if (!year) return null;

  return (
    <BreadcrumbProvider label={year} path={year}>
      <Outlet />
    </BreadcrumbProvider>
  );
};

export default Festival;
