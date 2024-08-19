import { Money } from '@/components/atoms/Money';
import { Callout, Flex, Grid, Link, RadioCards, Text, TextField } from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { useDonation } from './DonationProvider';
import { LEVELS, PageProps } from './types';

import styles from './Donate.module.css';

const Levels: React.FC<PageProps> = ({ formRef }) => {
  const { setAmount, setValid } = useDonation();

  const customAmountField = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: {
      amount: 0,
      customAmount: 2000,
      custom: false as boolean,
    },
  });

  const amount = form.useStore(({ values }) =>
    values.custom ? values.customAmount : values.amount
  );

  useEffect(() => {
    setAmount(amount);
    setValid(!!amount);
  }, [amount, setValid]);

  useImperativeHandle(formRef, () => ({
    submit: () => Promise.resolve(),
  }));

  return (
    <Flex className={styles.page} direction="column" gap="4">
      <Text as="div" size={{ initial: '2', sm: '3' }}>
        <p>
          We do our best to keep costs down, because we believe that NZIF should be for everyone.
        </p>
        <p>
          However, the arts funding landscape means we're finding it harder to make ends meet while
          still delivering on quality.
        </p>
        <p>
          If you feel able to give a little extra to help keep the Festival running, we’d really
          appreciate anything you can spare. Donations of $5 or more are tax deductible in New
          Zealand.
        </p>
      </Text>

      <form.Field name="amount">
        {(amount) => (
          <form.Field name="custom">
            {(custom) => (
              <Grid
                asChild
                rows={{
                  initial: `repeat(${LEVELS.length + 1}, 1fr)`,
                  sm: `repeat(${LEVELS.length / 2 + 1}, 1fr)`,
                }}
                className={styles.amounts}
              >
                <RadioCards.Root
                  gap={{ initial: '1', md: '3' }}
                  size={{ initial: '1', lg: '2' }}
                  defaultValue={String(amount.state.value)}
                  onValueChange={(value) => {
                    if (value === 'custom') {
                      custom.handleChange(true);
                      customAmountField.current?.focus();
                    } else {
                      custom.handleChange(false);
                      amount.handleChange(Number(value));
                    }
                  }}
                >
                  <RadioCards.Item
                    value="custom"
                    style={{
                      gridColumn: '1 / -1',
                      gridRow: -2,
                    }}
                    onFocus={() => customAmountField.current?.focus()}
                  >
                    <Text as="div" size={{ initial: '1', sm: '2' }}>
                      Custom amount
                    </Text>
                    <form.Field name="customAmount">
                      {(customAmount) => (
                        <TextField.Root
                          ref={customAmountField}
                          className={styles.customAmount}
                          variant="soft"
                          color="gray"
                          type="number"
                          min="1"
                          step={5}
                          defaultValue={customAmount.state.value / 100}
                          onChange={(e) => {
                            if (!e.currentTarget.value) {
                              customAmount.handleChange(0);
                              return;
                            }

                            if (e.currentTarget.value.length > 8) {
                              return;
                            }

                            customAmount.handleChange(e.currentTarget.valueAsNumber * 100);
                          }}
                        >
                          <TextField.Slot side="left">
                            <Text weight="medium" size={{ initial: '3', sm: '6' }}>
                              $
                            </Text>
                          </TextField.Slot>
                        </TextField.Root>
                      )}
                    </form.Field>
                  </RadioCards.Item>
                  {LEVELS.map((level, i) => (
                    <RadioCards.Item
                      key={level.amount}
                      className={styles.fixedAmount}
                      value={String(level.amount)}
                    >
                      <Text weight="medium" size={{ initial: '3', sm: '6' }}>
                        <Money cents={level.amount} />
                      </Text>
                      <Text as="div" size={{ initial: '1', sm: '2' }}>
                        {level.value}
                      </Text>
                    </RadioCards.Item>
                  ))}
                </RadioCards.Root>
              </Grid>
            )}
          </form.Field>
        )}
      </form.Field>

      <Callout.Root color="yellow">
        <Callout.Text m="0">
          Interested in corporate sponsorship? Contact{' '}
          <Link href="mailto:partnerships@improvfest.nz">Marea, our Partnerships Manager</Link>.
        </Callout.Text>
      </Callout.Root>
    </Flex>
  );
};

Levels.displayName = 'Levels';

export default Levels;
