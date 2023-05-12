import React, { useMemo } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { kebabCase } from 'lodash-es';
import pluralize from 'pluralize';

import { ActivityType } from '@/graphql/types';
import usePrevious from '@/hooks/usePrevious';
import { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import Header from '@/organisms/Header';

import UserOverview from './Users/User';
import Activities from './Activities';
import Dashboard from './Dashboard';
import Festival from './Festival';
import Timetable from './Timetable';
import Users from './Users';

import './Admin.css';

const pageVariants: Variants = {
  from: (direction = -1) => ({
    opacity: 0,
    x: `${direction * -100}vw`,
    transition: { ease: [0.4, 0, 0.2, 1] },
  }),
  in: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', bounce: 0.2 },
  },
  to: (direction = -1) => ({
    opacity: 0,
    x: `${direction * 100}vw`,
    transition: { ease: [0.4, 0, 0.2, 1] },
  }),
};

const CONTAINERS: RegExp[] = [/^(\/admin\/users\/[^/]+)/, /^(\/admin\/\d{4}\/)/];

const Admin: React.FC = () => {
  const location = useLocation();

  const locationKey = useMemo(() => {
    for (let i = 0; i < CONTAINERS.length; i++) {
      const match = location.pathname.match(CONTAINERS[i]);
      if (match?.[1] && match?.[2]) return match[1].replace(match[2], '?');
      if (match) return match[1];
    }
    return location.pathname;
  }, [location]);

  const locationKeyWas = usePrevious(locationKey);

  const direction = useMemo(() => {
    if (!locationKeyWas) return 0;
    console.log(locationKeyWas, locationKey);
    const la = locationKeyWas.split('/').length;
    const lb = locationKey.split('/').length;
    return la < lb ? -1 : 1;
  }, [locationKeyWas, locationKey]);

  return (
    <BreadcrumbProvider label="Admin" path="admin">
      <Header />
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.main
          key={locationKey}
          variants={pageVariants}
          initial="from"
          animate="in"
          exit="to"
        >
          <Routes location={location} key={locationKey}>
            <Route path="" element={<Dashboard />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id/*" element={<UserOverview />} />
            <Route path=":year" element={<Festival />}>
              {Object.values(ActivityType).map((type) => (
                <Route
                  key={type}
                  path={kebabCase(pluralize(type))}
                  element={<Activities type={type} />}
                />
              ))}
            </Route>
          </Routes>
        </motion.main>
      </AnimatePresence>
    </BreadcrumbProvider>
  );
};

export default Admin;
