import { Flex } from '@radix-ui/themes';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useImperativeHandle, useState } from 'react';
import { useDonation } from './DonationProvider';
import { PageProps } from './types';

import styles from './Donate.module.css';

const Payment: React.FC<PageProps> = ({ formRef }) => {
  const { amount, clientSecret } = useDonation();

  const [error, setError] = useState<string | null>(null);

  const stripe = useStripe();
  const elements = useElements();

  useImperativeHandle(formRef, () => ({
    submit: async () => {
      if (!stripe || !elements || !clientSecret) {
        setError('Stripe not loaded');
        return;
      }

      setError(null);

      elements.submit();

      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
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
      <PaymentElement />
    </Flex>
  );
};

Payment.displayName = 'Payment';

export default Payment;
