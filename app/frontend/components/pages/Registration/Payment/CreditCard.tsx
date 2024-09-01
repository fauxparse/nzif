import { Spinner } from '@/components/atoms/Spinner';
import WarningIcon from '@/icons/WarningIcon';
import { useLazyQuery } from '@apollo/client';
import { Callout, Flex } from '@radix-ui/themes';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Stripe, StripeElements, loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { PaymentIntentQuery } from '../queries';
import { PaymentMethod, PaymentMethodProps } from './types';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const CreditCard: React.FC<PaymentMethodProps> = ({ amount, active, handle }) => {
  const [{ stripe, elements }, loaded] = useState<{
    stripe: Stripe | null;
    elements: StripeElements | null;
  }>({
    stripe: null,
    elements: null,
  });

  const [fetchPaymentIntent, { loading, data }] = useLazyQuery(PaymentIntentQuery, {
    variables: { amount },
  });

  useEffect(() => {
    if (active && !loading) {
      fetchPaymentIntent({ variables: { amount } });
    }
  }, [active, loading]);

  const clientSecret = data?.registration?.paymentIntent?.clientSecret;

  useImperativeHandle(
    handle,
    () => ({
      method: 'CreditCardPayment' as PaymentMethod,
      submit: async () => {
        if (!stripe || !elements || !clientSecret) {
          return { error: 'Payment gateway not loaded' };
        }

        elements.submit();

        const result = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: `${location.origin}/register/completed`,
          },
        });

        if (result.error) {
          return { error: result.error?.message ?? 'An unknown error occurred' };
        }

        return true;
      },
    }),
    [stripe, elements, clientSecret]
  );

  if (loading || !data?.registration?.paymentIntent) {
    return (
      <Flex minHeight="150px" width="100%" justify="center" align="center">
        <Spinner size="4" />
      </Flex>
    );
  }

  if (!clientSecret) {
    return (
      <Callout.Root color="red">
        <Callout.Icon>
          <WarningIcon />
        </Callout.Icon>
        <Callout.Text>
          There was an error loading the payment gateway. Please try again later or select a
          different payment method.
        </Callout.Text>
      </Callout.Root>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          variables: {
            fontFamily: '"DIN Round Pro", sans-serif',
          },
        },
      }}
    >
      <StripeLoader onLoad={loaded} />
      <PaymentElement />
    </Elements>
  );
};

const StripeLoader = ({
  onLoad,
}: { onLoad: (value: { stripe: Stripe; elements: StripeElements }) => void }) => {
  const elements = useElements();
  const stripe = useStripe();

  useEffect(() => {
    if (stripe && elements) {
      onLoad({ stripe, elements });
    }
  }, [stripe, elements]);

  return null;
};
