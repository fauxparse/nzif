import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { DateTime } from 'luxon';

import { useRegistrationStatusQuery } from '@/graphql/types';
import usePrevious from '@/hooks/usePrevious';
import AnimatedOutlet from '@/pages/AnimatedOutlet';

import Footer from './Footer';
import { RegistrationContextProvider } from './RegistrationContext';
import Steps, { REGISTRATION_STEPS } from './Steps';

const variants: Variants = {
  entering: (direction = 1) => ({
    opacity: 0,
    x: `${direction * 100}vw`,
  }),
  in: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'tween',
      duration: 0.75,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exiting: (direction = 1) => ({
    opacity: 0,
    x: `${direction * -100}vw`,
    transition: {
      x: {
        type: 'tween',
        duration: 0.75,
        ease: 'anticipate',
      },
      opacity: {
        type: 'tween',
        duration: 0.75,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }),
};

const RegistrationLayout: React.FC = () => {
  const { data } = useRegistrationStatusQuery();

  const { pathname } = useLocation();

  const currentIndex = useMemo(
    () =>
      Math.max(
        REGISTRATION_STEPS.findIndex(({ path }) => pathname.endsWith(path)),
        0
      ),
    [pathname]
  );

  const currentIndexWas = usePrevious(currentIndex) || 0;

  const current = REGISTRATION_STEPS[currentIndex];

  const direction = currentIndex < currentIndexWas ? -1 : 1;

  const {
    festival = {
      __typename: 'Festival',
      id: String(DateTime.now().year),
      startDate: DateTime.now(),
      endDate: DateTime.now(),
      slots: [],
    },
    registration = {
      __typename: 'Registration',
      id: '',
      user: null,
      codeOfConductAcceptedAt: null,
      preferences: [],
    },
  } = data || {};

  return (
    <RegistrationContextProvider step={current} festival={festival} registration={registration}>
      <div className="registration">
        <h1>Register for NZIF {festival?.id}</h1>
        <Steps />

        <div className="registration__content">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={pathname}
              variants={variants}
              initial="entering"
              animate="in"
              exit="exiting"
              custom={direction}
            >
              <AnimatedOutlet />
            </motion.div>
          </AnimatePresence>
        </div>

        {registration?.user && <Footer />}
      </div>
    </RegistrationContextProvider>
  );
};

export default RegistrationLayout;
