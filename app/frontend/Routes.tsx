import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const Admin = lazy(() => import('./pages/Admin'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const Contentful = lazy(() => import('./pages/Contentful'));
const Public = lazy(() => import('./pages/Public'));
const Home = lazy(() => import('./pages/Public/Home'));

const suspend = (Component: React.FC) => (
  <Suspense>
    <Component />
  </Suspense>
);

const Routing: React.FC = () => (
  <Routes>
    <Route path="admin" element={suspend(Admin)}>
      <Route path="" element={suspend(Dashboard)} />
    </Route>
    <Route path="/" element={suspend(Public)}>
      <Route path="/" element={suspend(Home)} />
      <Route path=":slug" element={suspend(Contentful)} />
    </Route>
  </Routes>
);

export default Routing;
