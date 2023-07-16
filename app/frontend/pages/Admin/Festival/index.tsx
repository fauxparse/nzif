import React from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { useFestivalQuery } from '@/graphql/types';
import { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import { ROUTES } from '@/Routes';

import FestivalContext from './FestivalContext';

export const Component: React.FC = () => {
  const { year } = useParams<{ year: string }>() as { year: string };

  const { data } = useFestivalQuery({ variables: { year } });

  if (!data?.festival) return null;

  return (
    <BreadcrumbProvider label={year} path={ROUTES.ADMIN.FESTIVAL.buildPath({ year })}>
      <FestivalContext.Provider value={{ festival: data.festival }}>
        <Outlet />
      </FestivalContext.Provider>
    </BreadcrumbProvider>
  );
};

Component.displayName = 'Festival';

export default Component;
