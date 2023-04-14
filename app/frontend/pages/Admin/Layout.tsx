import React, { lazy, Suspense, useMemo } from 'react';
import { Route, Routes, useLocation, useRoutes } from 'react-router-dom';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import LocationContext from '../../../LocationContext';
import usePrevious from '../../hooks/usePrevious';
import Footer from '../../organisms/Footer';
import Header from '../../organisms/Header';
import AnimatedOutlet from '../AnimatedOutlet';

const Contentful = lazy(() => import('../Contentful'));

const suspend = (Component: React.FC) => (
  <Suspense>
    <Component />
  </Suspense>
);

const CONTAINERS: RegExp[] = [/^(\/admin\/users\/[^/]+)/];

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

const Routing: React.FC = () => {
  const location = useLocation();

  const previousLocation = usePrevious(location);

  const locationKey = useMemo(() => {
    for (let i = 0; i < CONTAINERS.length; i++) {
      const match = location.pathname.match(CONTAINERS[i]);
      if (match) return match[1];
    }
    return location.pathname;
  }, [location]);

  return (
    <>
      <Header />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.main
          key={locationKey}
          variants={pageVariants}
          initial="from"
          animate="in"
          exit="to"
          custom={-1}
        >
          <AnimatedOutlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  );
};

export default Routing;
