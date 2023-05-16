import React from 'react';
import { Route, Routes } from 'react-router-dom';

import PeopleList from './PeopleList';
import Person from './Person';

import './People.css';

const Activities: React.FC = () => {
  return (
    <Routes>
      <Route path=":id" element={<Person />} />
      <Route path="" element={<PeopleList />} />
    </Routes>
  );
};

export default Activities;
