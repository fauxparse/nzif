import { useMemo } from 'react';
import { uniq } from 'lodash-es';
import pluralize from 'pluralize';

import Icon from '@/atoms/Icon';

import { useRegistrationContext } from './RegistrationContext';

const BASE_PRICE = 60;
const DISCOUNT = 5;

const Cart: React.FC = () => {
  const { registration } = useRegistrationContext();

  const count = useMemo(
    () => uniq(registration.preferences.map((p) => p.slot.id)).length,
    [registration]
  );

  const value = count * BASE_PRICE;
  const discount = ((count * (count - 1)) / 2) * DISCOUNT;
  const total = value - discount;

  return (
    <div className="cart">
      <Icon name="cart" viewBox="-6 -6 36 36" />
      <div className="cart__count">
        {count ? pluralize('workshop', count, true) + ' selected' : 'No workshops selected'}
      </div>
      <div className="cart__price">
        {discount > 0 && <span className="cart__value">${value}</span>}
        <span className="cart__total">${total}</span> <abbr title="New Zealand dollars">NZD</abbr>
      </div>
    </div>
  );
};

export default Cart;
