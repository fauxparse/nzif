import pluralize from 'pluralize';

import Icon from '@/atoms/Icon';

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
        {discount > 0 && <span className="cart__value">${value}</span>}
        <span className="cart__total">${total}</span> <abbr title="New Zealand dollars">NZD</abbr>
      </div>
    </div>
  );
};

export default Cart;