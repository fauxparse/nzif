import { forwardRef, useMemo, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, HTMLMotionProps, motion, Variants } from 'framer-motion';
import { DateTime } from 'luxon';

import { RegistrationPhase, useRegistrationStatusQuery } from '@/graphql/types';
import usePrevious from '@/hooks/usePrevious';

import Footer from './Footer';
import { RegistrationContextProvider } from './RegistrationContext';
import Steps, { REGISTRATION_STEPS } from './Steps';

import './Registration.css';
import '../../Contentful/Contentful.css';

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

export const Component: React.FC = () => {
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

  const Component = current.component;

  const {
    festival = {
      __typename: 'Festival',
      id: String(DateTime.now().year),
      startDate: DateTime.now(),
      endDate: DateTime.now(),
      slots: [],
      earlybirdOpensAt: DateTime.now(),
      earlybirdClosesAt: DateTime.now(),
      generalOpensAt: DateTime.now(),
      registrationPhase: RegistrationPhase.Earlybird,
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
      <div
        className="registration"
        data-complete={currentIndex === REGISTRATION_STEPS.length - 1 || undefined}
      >
        <header className="registration__header">
          <h1>Register for NZIF {festival?.id}</h1>
          <Steps />
        </header>

        <div className="registration__content">
          <AnimatePresence initial={false} custom={direction}>
            <Page
              key={current.path}
              variants={variants}
              initial="entering"
              animate="in"
              exit="exiting"
              custom={direction}
            >
              <Component />
            </Page>
          </AnimatePresence>
        </div>

        {registration?.user && <Footer />}
      </div>
    </RegistrationContextProvider>
  );
};

Component.displayName = 'Registration';

const Page = forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(({ children, ...props }, ref) => {
  const ownRef = useRef<HTMLDivElement>(null);

  const animationComplete = () => {
    setTimeout(() => ownRef.current?.style?.removeProperty('transform'), 100);
  };

  return (
    <motion.div
      ref={mergeRefs([ownRef, ref])}
      className="registration__page"
      onAnimationComplete={animationComplete}
      {...props}
      onTransitionEnd={animationComplete}
    >
      {children}
    </motion.div>
  );
});

Page.displayName = 'Registration.Page';

export default Component;
