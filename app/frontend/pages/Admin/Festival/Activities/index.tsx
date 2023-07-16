import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import { ActivityType } from '@/graphql/types';

import ActivityDetails from './ActivityDetails';
import ActivityList from './ActivityList';

import './Activities.css';

type ActivitiesProps = {
  type: ActivityType;
};

const Activities: React.FC<ActivitiesProps> = ({ type }) => {
  return <Outlet />;
};

export default Activities;
