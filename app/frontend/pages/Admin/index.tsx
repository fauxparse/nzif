import React, { useMemo } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import { BreadcrumbProvider } from '../../molecules/Breadcrumbs';
import Header from '../../organisms/Header';

import UserOverview from './Users/User';
import Dashboard from './Dashboard';
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
  to: (direction = 1) => ({
    opacity: 0,
    x: `${direction * 100}vw`,
    transition: { ease: [0.4, 0, 0.2, 1] },
  }),
};

const CONTAINERS: RegExp[] = [/^(\/admin\/users\/[^/]+)/];

const Admin: React.FC = () => {
  const location = useLocation();

  const locationKey = useMemo(() => {
    for (let i = 0; i < CONTAINERS.length; i++) {
      const match = location.pathname.match(CONTAINERS[i]);
      if (match) return match[1];
    }
    return location.pathname;
  }, [location]);

  return (
    <BreadcrumbProvider label="Admin" path="admin">
      <Header />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.main
          key={locationKey}
          variants={pageVariants}
          initial="from"
          animate="in"
          exit="to"
        >
          <Routes location={location} key={location.pathname.replace(/users.*/, 'users')}>
            <Route path="" element={<Dashboard />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id/*" element={<UserOverview />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
    </BreadcrumbProvider>
  );
};

export default Admin;
