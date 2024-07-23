import { RouteTransition } from '@/components/helpers/RouteTransition';
import usePreviousDistinct from '@/hooks/usePreviousDistinct';
import { useRegistration } from '@/services/Registration';

import classes from './Registration.module.css';

export const Main = () => {
  const { stepIndex } = useRegistration();

  const stepIndexWas = usePreviousDistinct(stepIndex) ?? null;

  const direction =
    stepIndex === null || stepIndexWas === null || stepIndexWas < stepIndex ? 'left' : 'right';

  return (
    <div className={classes.main}>
      <RouteTransition direction={direction} />
    </div>
  );
};
