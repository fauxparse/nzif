import Logo from '@/components/atoms/Logo';
import { Outlet, getRouterContext, useLocation, useMatches } from '@tanstack/react-router';
import { AnimatePresence, MotionProps, Variants, motion, useIsPresent } from 'framer-motion';
import { cloneDeep } from 'lodash-es';
import { PropsWithChildren, forwardRef, useContext, useMemo, useRef } from 'react';

import './Authentication.css';

type AuthenticationProps = PropsWithChildren;

const variants: Variants = {
  out: {},
  in: {},
} as const;

export const Authentication: React.FC<AuthenticationProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="authentication">
      <div className="authentication__background">
        <div className="authentication__background__blob" />
        <div className="authentication__background__blob" />
        <div className="authentication__background__blob" />
      </div>
      <div className="authentication__frame">
        <div className="authentication__form">
          <Logo />
          <AnimatePresence initial={false} mode="popLayout">
            <AnimatedOutlet
              key={location.pathname}
              variants={variants}
              initial="out"
              animate="in"
              exit="out"
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const AnimatedOutlet = forwardRef<HTMLDivElement, MotionProps>((props, ref) => {
  const isPresent = useIsPresent();

  const matches = useMatches();
  const prevMatches = useRef(matches);

  const RouterContext = getRouterContext();
  const routerContext = useContext(RouterContext);

  const renderedContext = useMemo(() => {
    if (isPresent) {
      prevMatches.current = cloneDeep(matches);
      return routerContext;
    }
    const renderedContext = cloneDeep(routerContext);
    renderedContext.__store.state.matches = [
      ...matches.map((m, i) => ({
        ...(prevMatches.current[i] || m),
        id: m.id,
      })),
      ...prevMatches.current.slice(matches.length),
    ];
    return renderedContext;
  }, [routerContext, isPresent, prevMatches.current, matches]);

  return (
    <motion.div ref={ref} className="outlet" {...props}>
      <RouterContext.Provider value={renderedContext}>
        <Outlet />
      </RouterContext.Provider>
    </motion.div>
  );
});
