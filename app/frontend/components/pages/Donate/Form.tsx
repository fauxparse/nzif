import { Checkbox } from '@/components/atoms/Checkbox';
import { Money } from '@/components/atoms/Money';
import { FormField } from '@/components/molecules/FormField';
import ChevronRightIcon from '@/icons/ChevronRightIcon';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  RadioCards,
  Separator,
  Text,
  TextField,
} from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';

import Logo from '@/components/atoms/Logo';
import { useRef } from 'react';
import styles from './Donate.module.css';

type DonationFields = {
  name: string;
  email: string;
  message: string;
  anonymous: boolean;
  newsletter: boolean;
  amount: number;
  custom: boolean;
  customAmount: number;
};

const LEVELS = [
  { amount: 1500, value: 'pays a team member for half an hour' },
  { amount: 3300, value: 'gives accommodation to an artist for one night' },
  { amount: 5000, value: 'pays for one social media ad' },
  { amount: 10000, value: 'hires one of the venues at BATS for one day' },
  { amount: 20000, value: 'pays a tutor to teach one workshop' },
  { amount: 24000, value: 'pays for a show to perform' },
  { amount: 30000, value: 'hires BATS for a day' },
  { amount: 50000, value: 'covers all costs to put on one show' },
] as const;

const size = { initial: '2', lg: '3' } as const;

export const Form: React.FC = () => {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      message: '',
      anonymous: false,
      newsletter: false,
      amount: 20000,
      custom: false,
      customAmount: 0,
    } as DonationFields,
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  const customAmountField = useRef<HTMLInputElement>(null);

  return (
    <Grid asChild className={styles.form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Text as="div" className={styles.intro} size={size}>
          <Logo className={styles.logo} />
          <Heading size={{ initial: '6', lg: '8' }}>Donate to NZIF</Heading>
          <p>
            We do our best to keep costs down, because we believe that NZIF should be for everyone.
          </p>
          <p>
            However, the increasingly competitive arts funding landscape has meant that for the past
            three years we have received no funding from Creative New Zealand, and we’re finding it
            hard to make ends meet.
          </p>
          <p>
            If you feel able to give a little extra to help keep the Festival running, we’d really
            appreciate anything you can spare. Donations of $5 or more are tax deductible in New
            Zealand.
          </p>
        </Text>

        <Flex direction="column" gap="4" className={styles.details}>
          <form.Field
            name="name"
            validators={{
              onSubmit: z.string().nonempty('Please enter your name'),
            }}
          >
            {(field) => (
              <FormField.Root label="Your name" size={size} error={field.state.meta.errors[0]}>
                <FormField.TextField
                  autoComplete="name"
                  value={field.state.value}
                  onValueChange={field.handleChange}
                />
              </FormField.Root>
            )}
          </form.Field>
          <form.Field
            name="email"
            validators={{ onSubmit: z.string().email('Please enter a valid email address') }}
          >
            {(field) => (
              <FormField.Root
                label="Your email address"
                size={size}
                error={field.state.meta.errors[0]}
              >
                <FormField.TextField
                  type="email"
                  autoComplete="email"
                  value={field.state.value}
                  onValueChange={field.handleChange}
                />
              </FormField.Root>
            )}
          </form.Field>
          <form.Field name="message">
            {(field) => (
              <FormField.Root label="Your message (optional)" size={size}>
                <FormField.TextArea value={field.state.value} onValueChange={field.handleChange} />
              </FormField.Root>
            )}
          </form.Field>
          <form.Field name="anonymous">
            {(field) => (
              <label className={styles.labeledCheckbox}>
                <Checkbox
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                />
                <Text as="div" size={size}>
                  I’d like to remain anonymous
                </Text>
                <Box asChild gridColumn="2">
                  <Text size="2" color="gray">
                    We won’t publish your name in our donor list
                  </Text>
                </Box>
              </label>
            )}
          </form.Field>
          <form.Field name="newsletter">
            {(field) => (
              <label className={styles.labeledCheckbox}>
                <Checkbox
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                />
                <Text as="div" size={size}>
                  Sign me up for the NZIF Backstage newsletter
                </Text>
              </label>
            )}
          </form.Field>
        </Flex>

        <Separator orientation="vertical" size="4" className={styles.separator} />

        <form.Field name="amount">
          {(field) => (
            <form.Field name="custom">
              {(custom) => (
                <Grid
                  rows={{
                    initial: `repeat(${LEVELS.length + 1}, 1fr)`,
                    sm: `repeat(${LEVELS.length / 2 + 1}, 1fr)`,
                  }}
                  asChild
                  className={styles.amounts}
                >
                  <RadioCards.Root
                    gap={{ initial: '1', md: '3' }}
                    size={{ initial: '1', lg: '2' }}
                    defaultValue={String(field.state.value)}
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      if (!target.checked) return;

                      if (target.value === 'custom') {
                        custom.handleChange(true);
                        customAmountField.current?.focus();
                      } else {
                        custom.handleChange(false);
                        field.handleChange(Number(target.value));
                      }
                    }}
                  >
                    <form.Field name="customAmount">
                      {(customAmount) => (
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
                          <TextField.Root
                            ref={customAmountField}
                            className={styles.customAmount}
                            variant="soft"
                            color="gray"
                            type="number"
                            min="1"
                            step={5}
                            value={customAmount.state.value / 100}
                            onChange={(e) => {
                              customAmount.handleChange(e.currentTarget.valueAsNumber * 100);
                            }}
                            onBlur={(e) => {
                              if (!e.currentTarget.value) {
                                customAmount.handleChange(100);
                              }
                            }}
                          >
                            <TextField.Slot side="left">
                              <Text weight="medium" size={{ initial: '3', sm: '6' }}>
                                $
                              </Text>
                            </TextField.Slot>
                          </TextField.Root>
                        </RadioCards.Item>
                      )}
                    </form.Field>
                    {LEVELS.map((level, i) => (
                      <RadioCards.Item
                        key={level.amount}
                        className={styles.fixedAmount}
                        value={String(level.amount)}
                      >
                        <Text weight="medium" size={{ initial: '3', sm: '6' }}>
                          <Money cents={level.amount} />
                        </Text>
                        <Text as="div" size="1">
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

        <form.Subscribe
          selector={(state) =>
            state.values.custom ? state.values.customAmount : state.values.amount
          }
        >
          {(amount) => (
            <Button className={styles.button} type="submit" variant="solid" size="3">
              {Number.isNaN(amount) ? (
                'Donate'
              ) : (
                <span>
                  Donate <Money cents={amount} />
                </span>
              )}
              <ChevronRightIcon />
            </Button>
          )}
        </form.Subscribe>
      </form>
    </Grid>
  );
};
