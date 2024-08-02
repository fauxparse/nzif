import { Money } from '@/components/atoms/Money';
import CartIcon from '@/icons/CartIcon';
import { usePricing } from '@/services/Pricing';
import { Flex, Text } from '@radix-ui/themes';
import pluralize from 'pluralize';
import { usePreferences } from './Workshops/WorkshopPreferencesProvider';

import classes from './Registration.module.css';

export const CartSummary: React.FC = () => {
  const { totalValue, packagePrice } = usePricing();

  const { count } = usePreferences();

  const value = totalValue(count);
  const total = packagePrice(count);

  return (
    <Flex className={classes.cart}>
      <CartIcon />
      <Text className={classes.count}>{pluralize('workshop', count, true)}</Text>
      {value > total && (
        <del>
          <Money cents={value} />
        </del>
      )}
      <Money cents={total} />
    </Flex>
  );
};
