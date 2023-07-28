import pluralize from 'pluralize';

import Icon from '@/atoms/Icon';
import Money from '@/atoms/Money';

import useCartCalculator from './useCartCalculator';

const Cart: React.FC = () => {
  const { count, value, discount, total } = useCartCalculator();

  return (
    <div className="cart">
      <Icon name="cart" viewBox="-6 -6 36 36" />
      <div className="cart__count">
        {count ? pluralize('workshop', count, true) + ' selected' : 'No workshops selected'}
      </div>
      <div className="cart__price">
        {discount > 0 && <Money className="cart__value" cents={value} />}
        <Money className="cart__total" cents={total} includeCurrency>
          ${total}
        </Money>
      </div>
    </div>
  );
};

export default Cart;
