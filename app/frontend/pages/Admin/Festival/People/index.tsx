import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import PeopleList from './PeopleList';
import Person from './Person';

import './People.css';

export const Component: React.FC = () => {
  return <Outlet />;
};

Component.displayName = 'People';

export default Component;
