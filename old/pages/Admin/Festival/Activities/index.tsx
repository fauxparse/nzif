import React from 'react';
import { Outlet } from 'react-router-dom';

import { ActivityType } from '@/graphql/types';

import './Activities.css';

type ActivitiesProps = {
  type: ActivityType;
};

const Activities: React.FC<ActivitiesProps> = ({ type }) => {
  return <Outlet />;
};

export default Activities;
