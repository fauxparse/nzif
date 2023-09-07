import { useState } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { useRegistrationContext } from '../RegistrationContext';
import useCartCalculator from '../useCartCalculator';
import Icon from '@/atoms/Icon';
import { cache } from '@/graphql';

type StripeCheckoutProps = {
  next: () => void;
};

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ next }) => {
  const stripe = useStripe();
  const elements = useElements();

  const { setBusy, registration, festival } = useRegistrationContext();

  const { total } = useCartCalculator(registration, festival);

  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!stripe || !elements) return;

    setError(null);
    setBusy(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/registration/complete`,
      },
      redirect: 'if_required',
    });

    setBusy(false);

    if (error) {
      setError(error.message || 'There was an error processing your payment. Please try again.');
      return;
    } else {
      cache.modify({
        id: `Cart:${registration.id}`,
        fields: {
          outstanding: () => 0,
          paid: () => total,
        },
      });

      next();
    }
  };

  return (
    <form className="stripe-checkout" id="registration-form" onSubmit={submit}>
      {error && (
        <div className="stripe-checkout__error" role="alert">
          <Icon name="alert" />
          {error}
        </div>
      )}
      <PaymentElement />
    </form>
  );
};

export default StripeCheckout;
