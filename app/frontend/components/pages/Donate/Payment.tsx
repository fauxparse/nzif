import WarningIcon from '@/icons/WarningIcon';
import { useMutation } from '@apollo/client';
import { Callout, Flex } from '@radix-ui/themes';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useImperativeHandle, useState } from 'react';
import { useDonation } from './DonationProvider';
import { CreateDonationPayment } from './queries';
import { PageProps } from './types';

import styles from './Donate.module.css';

const Payment: React.FC<PageProps> = ({ formRef }) => {
  const { amount, id } = useDonation();

  const [error, setError] = useState<string | null>(null);

  const [createPayment] = useMutation(CreateDonationPayment);

  const stripe = useStripe();
  const elements = useElements();

  useImperativeHandle(formRef, () => ({
    submit: async () => {
      if (!stripe || !elements || !id) {
        setError('Stripe not loaded');
        return;
      }

      setError(null);

      elements.submit();

      const { data } = await createPayment({
        variables: {
          id,
        },
      });

      if (!data?.createDonationPayment?.paymentIntentSecret) {
        setError('Failed to create payment');
        return;
      }

      const result = await stripe.confirmPayment({
        elements,
        clientSecret: data.createDonationPayment.paymentIntentSecret,
        confirmParams: {
          return_url: `${location.origin}/${location.pathname}/thanks`,
        },
      });

      if (result.error) {
        setError(result.error?.message ?? null);
      }
    },
  }));

  return (
    <Flex className={styles.page} direction="column" gap="4">
      {error && (
        <Callout.Root>
          <Callout.Icon>
            <WarningIcon />
          </Callout.Icon>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <PaymentElement />
    </Flex>
  );
};

Payment.displayName = 'Payment';

export default Payment;
