import React from 'react';
import { Outlet } from 'react-router-dom';

export const Component: React.FC = () => {
  return <Outlet />;
};

Component.displayName = 'Admin';

export default Component;
