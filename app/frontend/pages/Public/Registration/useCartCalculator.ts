import { uniq } from 'lodash-es';
import { useMemo } from 'react';

import CONFIG from '@/../../config/pricing.yml';
import { PaymentState, RegistrationPhase, RegistrationStatusQuery } from '@/graphql/types';

const BASE_PRICE = CONFIG.pricing.base_workshop_price;
const DISCOUNT = CONFIG.pricing.discount_per_additional_workshop;

type Registration = RegistrationStatusQuery['registration'];
type Festival = RegistrationStatusQuery['festival'];

const useCartCalculator = (registration: Registration, festival: Festival) => {
  const count = useMemo(() => {
    if (festival.registrationPhase === RegistrationPhase.Earlybird) {
      return uniq(registration.preferences.map((p) => p.slot.id)).length;
    }
    return registration.sessions.length;
  }, [registration, festival.registrationPhase]);

  const value = count * BASE_PRICE;
  const discount = ((count * (count - 1)) / 2) * DISCOUNT;
  const total = value - discount;
  const paid = (registration.payments || []).reduce(
    (acc, p) => (p.state === PaymentState.Approved ? acc + p.amount : acc),
    0
  );
  const outstanding = Math.max(0, total - paid);
  const refundDue = Math.max(0, paid - total);

  return {
    base: BASE_PRICE,
    count,
    value,
    discount,
    total,
    paid,
    outstanding,
    refundDue,
  };
};

export default useCartCalculator;
