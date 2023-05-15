import React, { useMemo } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import { useEditUserQuery, User } from '@/graphql/types';
import usePrevious from '@/hooks/usePrevious';
import { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import Breadcrumbs from '@/molecules/Breadcrumbs/Breadcrumbs';
import Tabs from '@/molecules/Tabs/Tabs';

import Details from './Details';
import Schedule from './Schedule';
import { UserContext } from './useUserContext';

import './User.css';

const tabVariants: Variants = {
  from: (direction) => ({ opacity: 0, x: `${direction * -25}vw` }),
  in: { opacity: 1, x: 0, transition: { type: 'spring', bounce: 0.2 } },
  to: (direction) => ({
    opacity: 0,
    x: `${direction * 25}vw`,
    transition: { type: 'spring', bounce: 0.2 },
  }),
};

const UserOverview: React.FC = () => {
  const location = useLocation();

  const selectedTab = location.pathname.split('/')[4] || 'details';

  const selectedTabWas = usePrevious(selectedTab);

  const { id } = useParams<{ id: string }>() as { id: string };

  const { data, loading } = useEditUserQuery({ variables: { id } });

  const direction = useMemo(() => {
    if (selectedTabWas === undefined) return 0;
    const a = ['details', 'schedule'].indexOf(selectedTabWas);
    const b = ['details', 'schedule'].indexOf(selectedTab);
    return a < b ? -1 : 1;
  }, [selectedTab, selectedTabWas]);

  if (loading) return null;

  const user = (data?.user as User) || null;

  const basePath = location.pathname.split('/').slice(0, 4).join('/');

  return (
    <BreadcrumbProvider label={'People'} path="people">
      <div className="page">
        <header className="page__header">
          <Breadcrumbs />
          <h1>{user?.name}</h1>
          <Tabs>
            <Tabs.Tab
              as={Link}
              to={`${basePath}/details`}
              text="Details"
              selected={selectedTab === 'details'}
            />
            <Tabs.Tab
              as={Link}
              to={`${basePath}/schedule`}
              text="Schedule"
              selected={selectedTab === 'schedule'}
            />
          </Tabs>
        </header>
        {user && (
          <UserContext.Provider value={{ user, basePath }}>
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              <motion.div
                key={selectedTab}
                className="tabs__content"
                variants={tabVariants}
                initial="from"
                animate="in"
                exit="to"
                custom={direction}
              >
                <Routes location={location} key={selectedTab}>
                  <Route path="details" element={<Details />} />
                  <Route path="schedule" element={<Schedule />} />
                  <Route path="" element={<Navigate to={`${basePath}/details`} />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </UserContext.Provider>
        )}
      </div>
    </BreadcrumbProvider>
  );
};

export default UserOverview;
