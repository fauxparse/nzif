import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { kebabCase, mapKeys } from 'lodash-es';

import { useRegistrationContext } from '../RegistrationContext';
import useCartCalculator from '../useCartCalculator';
import Money from '@/atoms/Money';
import Radio from '@/atoms/Radio';
import { getAuthenticationInfo } from '@/graphql/authentication';
import { useFinaliseRegistrationMutation } from '@/graphql/types';

import Cart from './Cart';
import StripeCheckout from './StripeCheckout';

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
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const { registration, festival, next } = useRegistrationContext();

  const { outstanding } = useCartCalculator(registration, festival);

  useEffect(() => {
    setStripePromise(loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY));
  }, []);

  const requested = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!registration || outstanding <= 0 || requested.current === outstanding) return;

    const authentication = getAuthenticationInfo();

    fetch('/payment_intents', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'X-CSRF-Token':
          document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        ...mapKeys(authentication, (_, key) => kebabCase(key)),
      }),
      body: JSON.stringify({
        amount: outstanding,
        registration_id: registration.id,
      }),
    })
      .then((res) => res.json())
      .then(({ clientSecret }) => setClientSecret(clientSecret));

    requested.current = outstanding;
  }, [outstanding, registration]);

  const [finaliseRegistration] = useFinaliseRegistrationMutation();

  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('CreditCard');

  return (
    <div className="registration__payment">
      <div className="registration__payment__general">
        <h2>
          {outstanding > 0 ? (
            <>
              You have <Money cents={outstanding} /> to pay
            </>
          ) : (
            'You’re all paid up'
          )}
        </h2>

        {stripePromise && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
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

            {paymentMethod === 'CreditCard' && <StripeCheckout />}

            <p className="note">
              If paying the full amount today doesn’t work for you, please{' '}
              <a href="mailto:hello@improvfest.nz">get in touch</a> to talk about your options.
            </p>
          </Elements>
        )}
      </div>
      {registration && festival && <Cart registration={registration} festival={festival} />}
    </div>
  );
};

export default General;
