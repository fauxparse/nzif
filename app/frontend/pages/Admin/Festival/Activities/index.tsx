import React from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';

import Button from '@/atoms/Button';
import { ActivityType } from '@/graphql/types';
import Breadcrumbs from '@/molecules/Breadcrumbs';
import Tabs from '@/molecules/Tabs';

import ActivityTab from './ActivityList/ActivityTab';
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
