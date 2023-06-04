import { Route, Routes } from 'react-router-dom';

import AboutYou from './AboutYou';
import Layout from './Layout';
import WorkshopSelection from './WorkshopSelection';

import './Registration.css';
import '../../Contentful/Contentful.css';

const Registration: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="workshops" element={<WorkshopSelection />} />
        <Route index element={<AboutYou />} />
      </Route>
    </Routes>
  );
};

export default Registration;
