import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { ActivityType } from '@/graphql/types';

import ActivityDetails from './ActivityDetails';
import ActivityList from './ActivityList';

import './Activities.css';

type ActivitiesProps = {
  type: ActivityType;
};

const Activities: React.FC<ActivitiesProps> = ({ type }) => {
  return (
    <Routes>
      <Route path=":slug/*" element={<ActivityDetails type={type} />} />
      <Route path="" element={<ActivityList type={type} />} />
    </Routes>
  );
};

export default Activities;
