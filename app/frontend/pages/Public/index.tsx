import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import usePrevious from '@/hooks/usePrevious';
import { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import Footer from '@/organisms/Footer';
import Header from '@/organisms/Header';
import AnimatedOutlet from '@/pages/AnimatedOutlet';
import { ROUTES } from '@/Routes';

const CONTAINERS: [RegExp, string][] = [
  [/^(\/\d{4}\/register\/)/, 'register'],
  [/^(\/\d{4}\/(shows|workshops)\/[^/]+)/, 'activity'],
  [/^(\/\d{4}\/)(shows|workshops)$/, 'activities'],
];

export const pageVariants: Variants = {
  from: (direction = -1) => ({
    opacity: 0,
    x: `${direction * -100}vw`,
    transition: { ease: [0.4, 0, 0.2, 1], duration: 0.3 },
  }),
  in: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', bounce: 0.2 },
  },
  to: (direction = 1) => ({
    opacity: 0,
    x: `${direction * 100}vw`,
    transition: { ease: [0.4, 0, 0.2, 1], duration: 0.3 },
  }),
};

export const Component: React.FC = () => {
  const { year } = useTypedParams(ROUTES.FESTIVAL);

  const location = useLocation();

  const locationKey = useMemo(() => {
    for (let i = 0; i < CONTAINERS.length; i++) {
      const match = location.pathname.match(CONTAINERS[i][0]);
      if (match) return CONTAINERS[i][1];
    }
    return location.pathname;
  }, [location]);

  const previousLocation = usePrevious(location);

  const direction = previousLocation && previousLocation?.pathname > location.pathname ? 1 : -1;

  return (
    <BreadcrumbProvider label={year} path={year}>
      <Header />
      <AnimatePresence mode="popLayout" custom={direction} initial={false}>
        <motion.main
          key={locationKey}
          variants={pageVariants}
          initial="from"
          animate="in"
          exit="to"
          custom={direction}
        >
          <AnimatedOutlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </BreadcrumbProvider>
  );
};

Component.displayName = 'Public';

export default Component;
