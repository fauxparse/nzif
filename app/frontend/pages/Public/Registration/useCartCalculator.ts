import { useMemo } from 'react';
import { uniq } from 'lodash-es';

import CONFIG from '@/../../config/pricing.yml';

import { useRegistrationContext } from './RegistrationContext';

const BASE_PRICE = CONFIG.pricing.base_workshop_price;
const DISCOUNT = CONFIG.pricing.discount_per_additional_workshop;

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
