import { Flex } from '@radix-ui/themes';
import { CSSProperties, Fragment, ReactNode, useMemo } from 'react';
import { STEPS, StepDefinition, StepId, StepState } from './types';

import { motion } from 'framer-motion';
import classes from './RegistrationSteps.module.css';

type RootProps = {
  step: StepId;
  children: (props: { step: StepDefinition; state: StepState }) => ReactNode;
};

export const Root: React.FC<RootProps> = ({ step: currentStep, children }) => {
  const activeIndex = useMemo(
    () => STEPS.findIndex((step) => step.id === currentStep),
    [currentStep]
  );

  return (
    <Flex className={classes.container}>
      <Flex
        className={classes.steps}
        style={{ '--step-count': STEPS.length - 1, '--active-index': activeIndex } as CSSProperties}
      >
        <motion.span
          className={classes.completed}
          layout
          layoutId="step-completed"
          style={{ borderRadius: '32px' }}
        />
        <motion.span
          className={classes.highlight}
          layout
          layoutId="step-highlight"
          style={{ borderRadius: '32px' }}
        />
        {STEPS.slice(0, -1).map((step, i) => (
          <Fragment key={step.id}>
            {children({
              step,
              state: activeIndex === i ? 'active' : activeIndex > i ? 'completed' : 'pending',
            })}
          </Fragment>
        ))}
      </Flex>
    </Flex>
  );
};
