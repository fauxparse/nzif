import React from 'react';

import { BreadcrumbProvider } from '../../../molecules/Breadcrumbs';
import AnimatedOutlet from '../../AnimatedOutlet';

const Users: React.FC = () => (
  <BreadcrumbProvider label="Users" path="users">
    <AnimatedOutlet />
  </BreadcrumbProvider>
);

export default Users;
