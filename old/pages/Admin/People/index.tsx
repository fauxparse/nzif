import React from 'react';
import { Outlet } from 'react-router-dom';

import './People.css';

export const Component: React.FC = () => {
  return <Outlet />;
};

Component.displayName = 'People';

export default Component;
