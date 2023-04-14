import React, { lazy, Suspense, useMemo } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import LocationContext from '../LocationContext';

import usePrevious from './hooks/usePrevious';
import Public from './pages/Public';

const Admin = lazy(() => import('./pages/Admin'));
const Contentful = lazy(() => import('./pages/Contentful'));
const Home = lazy(() => import('./pages/Public/Home'));

const suspend = (Component: React.FC) => (
  <Suspense>
    <Component />
  </Suspense>
);

const CONTAINERS: RegExp[] = [/^(\/admin)/];

const Routing: React.FC = () => {
  const location = useLocation();

  const previousLocation = usePrevious(location);

  const locationKey = useMemo(() => {
    for (let i = 0; i < CONTAINERS.length; i++) {
      const match = location.pathname.match(CONTAINERS[i]);
      if (match) return match[1];
    }
    return location.pathname;
  }, [location]);

  return (
    <LocationContext.Provider value={{ location, previousLocation }}>
      <Routes location={location} key={locationKey}>
        <Route path="admin/*" element={suspend(Admin)} />
        <Route path="" element={<Public />}>
          <Route path="" element={suspend(Home)} />
          <Route path=":slug" element={suspend(Contentful)} />
        </Route>
      </Routes>
    </LocationContext.Provider>
  );
};

export default Routing;
