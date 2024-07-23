import { STEPS, useRegistration } from '@/services/Registration';
import { Flex, Text } from '@radix-ui/themes';
import classes from './Registration.module.css';

export const Steps = () => {
  const { stepIndex, step } = useRegistration();

  return (
    <Flex className={classes.steps}>
      {STEPS.slice(0, -1).map(({ icon: Icon, ...step }, index) => (
        <Flex
          key={step.id}
          className={classes.step}
          data-state={
            stepIndex === null || index > stepIndex
              ? 'pending'
              : index === stepIndex
                ? 'current'
                : 'complete'
          }
        >
          <Flex className={classes.stepIcon}>
            <Icon />
          </Flex>
          <Text className={classes.stepLabel}>{step.title}</Text>
        </Flex>
      ))}
    </Flex>
  );
};
