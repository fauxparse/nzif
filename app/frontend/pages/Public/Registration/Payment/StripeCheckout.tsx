import { useState } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { useRegistrationContext } from '../RegistrationContext';
import useCartCalculator from '../useCartCalculator';
import Icon from '@/atoms/Icon';
import { useFinaliseRegistrationMutation } from '@/graphql/types';

const StripeCheckout: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  const { registration, festival, next, setBusy } = useRegistrationContext();
  const { outstanding } = useCartCalculator(registration, festival);

  const [finaliseRegistration] = useFinaliseRegistrationMutation();

  const [error, setError] = useState<string | null>(
    'There was an error processing your payment. Please try again.'
  );

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
