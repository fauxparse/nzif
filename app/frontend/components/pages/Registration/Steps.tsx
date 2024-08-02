import { Money } from '@/components/atoms/Money';
import { usePricing } from '@/services/Pricing';
import { STEPS, useRegistration } from '@/services/Registration';
import { Flex, Text } from '@radix-ui/themes';
import pluralize from 'pluralize';
import classes from './Registration.module.css';
import { usePreferences } from './Workshops/WorkshopPreferencesProvider';

export const Steps = () => {
  const { stepIndex, step } = useRegistration();

  const { count } = usePreferences();
  const { totalValue, packagePrice } = usePricing();

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
          {step.id === 'workshops' && count > 0 && (
            <Text className={classes.stepInfo}>{pluralize('workshop', count, true)}</Text>
          )}
          {step.id === 'payment' && count > 0 && (
            <Text className={classes.stepInfo}>
              {count > 1 && (
                <del>
                  <Money cents={totalValue(count)} />
                </del>
              )}
              <Money cents={packagePrice(count)} />
            </Text>
          )}
        </Flex>
      ))}
    </Flex>
  );
};
