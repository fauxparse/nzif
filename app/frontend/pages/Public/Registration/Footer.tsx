import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import Button from '@/atoms/Button';

import Cart from './Cart';
import { useRegistrationContext } from './RegistrationContext';
import { REGISTRATION_STEPS } from './Steps';

const Footer: React.FC = () => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  const { step, festival } = useRegistrationContext();

  const { previous, next } = useMemo(() => {
    const currentIndex = REGISTRATION_STEPS.indexOf(step);

    return {
      previous: currentIndex > 0 ? REGISTRATION_STEPS[currentIndex - 1] : null,
      current: REGISTRATION_STEPS[currentIndex],
      next:
        currentIndex < REGISTRATION_STEPS.length - 1
          ? REGISTRATION_STEPS[currentIndex + 1]
          : {
              label: 'Finalise registration',
              path: '/register/thanks',
            },
    };
  }, [step]);

  useEffect(() => {
    if (!container) return;

    const intersectionObserver = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.intersectionRatio >= 1) {
          container.removeAttribute('data-stuck');
        } else {
          container.setAttribute('data-stuck', 'true');
        }
      },
      { threshold: [1] }
    );
    intersectionObserver.observe(container);
    return () => intersectionObserver.disconnect();
  }, [container]);

  return (
    <footer ref={setContainer} className="registration__footer">
      <Cart />
      {previous && (
        <Button
          as={Link}
          to={festival ? `/${festival.id}${previous.path}` : '/'}
          className="registration__button"
          icon="chevronLeft"
          data-action="previous"
          text={
            <>
              <small>Previous</small>
              <span>{previous.label}</span>
            </>
          }
        />
      )}
      {next && (
        <Button
          className="registration__button"
          icon="chevronRight"
          data-action="next"
          type="submit"
          form="registration-form"
          text={
            <>
              <small>Next</small>
              <span>{next.label}</span>
            </>
          }
        />
      )}
    </footer>
  );
};

export default Footer;
