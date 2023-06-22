import { useMemo } from 'react';
import { uniq } from 'lodash-es';

import { useRegistrationContext } from './RegistrationContext';

const BASE_PRICE = 60;
const DISCOUNT = 5;

const useCartCalculator = () => {
  const { registration } = useRegistrationContext();

  const count = useMemo(
    () => uniq(registration.preferences.map((p) => p.slot.id)).length,
    [registration]
  );

  const value = count * BASE_PRICE;
  const discount = ((count * (count - 1)) / 2) * DISCOUNT;
  const total = value - discount;

  return {
    base: BASE_PRICE,
    count,
    value,
    discount,
    total,
  };
};

export default useCartCalculator;
