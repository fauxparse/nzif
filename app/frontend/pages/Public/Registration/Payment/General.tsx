import React from 'react';

import { useRegistrationContext } from '../RegistrationContext';
import useCartCalculator from '../useCartCalculator';
import Money from '@/atoms/Money';
import Radio from '@/atoms/Radio';
import { useFinaliseRegistrationMutation } from '@/graphql/types';

import Cart from './Cart';

const PAYMENT_METHODS = [
  {
    id: 'CreditCard',
    label: 'Credit card',
    sub: 'via Stripe',
  },
  {
    id: 'InternetBanking',
    label: 'Internet banking',
    sub: 'to our NZ account',
  },
] as const;

type PaymentMethod = (typeof PAYMENT_METHODS)[number]['id'];

const General: React.FC = () => {
  const { registration, festival, next } = useRegistrationContext();
  const { outstanding } = useCartCalculator(registration, festival);

  const [finaliseRegistration] = useFinaliseRegistrationMutation();

  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('CreditCard');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (outstanding <= 0) {
      finaliseRegistration().then(() => next());
    }
  };

  return (
    <form id="registration-form" className="registration__payment" onSubmit={submit}>
      <div className="registration__payment__general">
        <h2>Pay now</h2>
        <p>
          You have <Money cents={outstanding} includeCurrency /> to pay.
        </p>
        <p>Please select your payment method:</p>

        <div className="payment-methods">
          {PAYMENT_METHODS.map((method) => (
            <label
              className="payment-method"
              key={method.id}
              aria-selected={paymentMethod === method.id || undefined}
            >
              <Radio
                name="paymentMethod"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={(e) => setPaymentMethod((p) => (e.target.checked ? method.id : p))}
              />
              <b>{method.label}</b>
              <small>{method.sub}</small>
            </label>
          ))}
        </div>
      </div>
      {registration && festival && <Cart registration={registration} festival={festival} />}
    </form>
  );
};

export default General;
