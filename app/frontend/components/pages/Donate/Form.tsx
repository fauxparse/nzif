import Logo from '@/components/atoms/Logo';
import { Heading } from '@radix-ui/themes';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { DonationProvider, useDonation } from './DonationProvider';
import { Footer } from './Footer';
import { FormHandle } from './types';

import styles from './Donate.module.css';

const stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const Form: React.FC = () => {
  return (
    <DonationProvider>
      <header>
        <Logo className={styles.logo} />
        <Heading size={{ initial: '6', sm: '8' }}>Donate to NZIF</Heading>
      </header>
      <Pages />
    </DonationProvider>
  );
};

const Pages = () => {
  const { page: Page, pageIndex, nextPage, amount } = useDonation();

  const [loading, setLoading] = useState(false);

  const formRef = useRef<FormHandle | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    formRef.current
      ?.submit()
      .then(() => {
        nextPage();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form style={{ display: 'contents' }} onSubmit={submit}>
      <Elements
        stripe={stripe}
        options={{
          mode: 'payment',
          amount: amount || 100,
          currency: 'nzd',
          appearance: {
            variables: {
              fontFamily: '"DIN Round Pro", sans-serif',
            },
          },
        }}
      >
        <div className={styles.pages}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={pageIndex}
              initial={{ x: '100vw' }}
              animate={{ x: 0 }}
              exit={{ x: '-100vw' }}
              transition={{
                ease: [0.4, 0, 0.2, 1],
                duration: 0.5,
              }}
            >
              <Page
                formRef={(form) => {
                  if (form) {
                    formRef.current = form;
                  }
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <Footer loading={loading} />
      </Elements>
    </form>
  );
};
