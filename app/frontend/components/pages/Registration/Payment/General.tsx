import { Checkbox } from '@/components/atoms/Checkbox';
import { Money } from '@/components/atoms/Money';
import { PaymentState } from '@/graphql/types';
import { usePricing } from '@/services/Pricing';
import { useRegistration } from '@/services/Registration';
import { Card, Flex, Heading, Link, Table, Text } from '@radix-ui/themes';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import pluralize from 'pluralize';
import { Buttons } from '../Buttons';
import { usePreferences } from '../Workshops/WorkshopPreferencesProvider';

import { Accordion } from '@/components/molecules/Accordion';
import { useMutation } from '@apollo/client';
import { useForm } from '@tanstack/react-form';
import { PropsWithChildren, useRef } from 'react';
import registrationClasses from '../Registration.module.css';
import { UpdateRegistrationMutation } from '../queries';
import { CreditCard } from './CreditCard';
import { InternetBanking } from './InternetBanking';
import classes from './Payment.module.css';
import { PaymentMethod, PaymentMethodHandle } from './types';

const PAYMENT_LABELS = {
  InternetBankingPayment: 'Internet banking',
  CreditCardPayment: 'Credit card',
  Voucher: 'Voucher',
} as const;

const usePaymentsWithState = (state: PaymentState) => {
  const { registration } = useRegistration();
  return registration?.payments?.filter((payment) => payment.state === state) || [];
};

const PAYMENT_METHODS = [
  {
    id: 'InternetBankingPayment',
    title: 'Internet banking',
    Component: InternetBanking,
  },
  {
    id: 'CreditCardPayment',
    title: 'Credit card',
    Component: CreditCard,
  },
] as const;

type FormType = {
  donateDiscount: boolean;
  paymentMethod: PaymentMethod;
};

export const General = () => {
  const { goToNextStep, registration } = useRegistration();
  const { totalValue, packageDiscount, packagePrice, basePrice } = usePricing();
  const { count } = usePreferences();

  const payment = useRef<PaymentMethodHandle | null>(null);

  const [update] = useMutation(UpdateRegistrationMutation);

  const form = useForm({
    defaultValues: {
      donateDiscount: registration?.donateDiscount ?? false,
      paymentMethod: 'InternetBankingPayment',
    } as FormType,
    onSubmit: async ({ value: { donateDiscount } }) => {
      if (!registration) return;

      if (donateDiscount !== registration.donateDiscount) {
        await update({ variables: { attributes: { donateDiscount } } });
      }

      if (!payment.current) {
        console.error('No payment method selected');
        return;
      }

      const result = await payment.current.submit();
      if (result !== true) {
        console.error('Payment failed', result.error);
        return;
      }

      // goToNextStep();
    },
  });

  const paid = usePaymentsWithState(PaymentState.Approved);
  const paidAmount = paid.reduce((sum, { amount }) => sum + amount, 0);

  const pending = usePaymentsWithState(PaymentState.Pending);
  const pendingAmount = pending.reduce((sum, { amount }) => sum + amount, 0);

  const donateDiscount = form.useStore((state) => state.values.donateDiscount);

  const totalPrice = donateDiscount ? totalValue(count) : packagePrice(count);

  const remainingAmount = Math.max(0, totalPrice - paidAmount);

  return (
    <form
      className={clsx(registrationClasses.page, classes.payment)}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div />
      <Flex asChild direction="column" gap="4">
        <Text as="div" size={{ initial: '3', md: '4' }}>
          <div>
            <Heading>Payment</Heading>
            <p>
              Payment for workshops is due in full before the workshop. If you’re unsure about your
              payment options or would like to arrange a payment plan, please contact us at{' '}
              <Link href="mailto:registrations@improvfest.nz?subject=Workshop+payments">
                registrations@improvfest.nz
              </Link>
              .
            </p>
          </div>

          <Table.Root className={classes.paymentTable} size="3" variant="surface">
            <Table.Body>
              <Table.Row>
                <Table.RowHeaderCell>{pluralize('workshop', count, true)}</Table.RowHeaderCell>
                <Table.Cell justify="end">
                  @ <Money cents={basePrice} />
                </Table.Cell>
                <Table.Cell align="right">
                  <Money cents={totalValue(count)} includeCurrency />
                </Table.Cell>
              </Table.Row>
              {count > 1 && (
                <Table.Row>
                  <Table.RowHeaderCell colSpan={2}>
                    <Text as="div">Package discount</Text>
                    <form.Field name="donateDiscount">
                      {(field) => (
                        <Card asChild size="1" className={classes.donateMyDiscount}>
                          <label>
                            <Checkbox
                              style={{ gridArea: 'checkbox' }}
                              checked={field.state.value}
                              onCheckedChange={(checked) => field.handleChange(!!checked)}
                            />
                            <Text as="div" size="2" weight="medium" style={{ gridArea: 'heading' }}>
                              Donate my discount
                            </Text>
                            <Text
                              as="div"
                              size="2"
                              color="gray"
                              style={{ gridArea: 'description' }}
                            >
                              This year we’re giving participants the option to donate their package
                              discount towards the cost of running the Festival. This is totally
                              optional!
                            </Text>
                          </label>
                        </Card>
                      )}
                    </form.Field>
                  </Table.RowHeaderCell>
                  <Table.Cell align="right">
                    <Money cents={-packageDiscount(count)} includeCurrency />
                  </Table.Cell>
                </Table.Row>
              )}
              {remainingAmount > 0 && remainingAmount < totalPrice && (
                <Table.Row>
                  <Table.RowHeaderCell colSpan={2}>
                    <b>Subtotal</b>
                  </Table.RowHeaderCell>
                  <Table.Cell align="right">
                    <Text weight="bold">
                      <Money cents={totalPrice} includeCurrency />
                    </Text>
                  </Table.Cell>
                </Table.Row>
              )}
              {paid.map((payment) => (
                <Table.Row key={payment.id}>
                  <Table.RowHeaderCell colSpan={2}>
                    <Text as="div">
                      {PAYMENT_LABELS[payment.__typename as keyof typeof PAYMENT_LABELS]}
                    </Text>
                    <Text as="div" color="gray" size="2">
                      {payment.createdAt.toLocaleString(DateTime.DATE_FULL)}
                    </Text>
                  </Table.RowHeaderCell>
                  <Table.Cell align="right">
                    <Money cents={-payment.amount} includeCurrency />
                  </Table.Cell>
                </Table.Row>
              ))}
              <Table.Row>
                <Table.RowHeaderCell colSpan={2}>
                  <b>Total to pay</b>
                </Table.RowHeaderCell>
                <Table.Cell align="right">
                  <Text size="5" weight="bold">
                    <Money cents={remainingAmount} includeCurrency />
                  </Text>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>

          {remainingAmount > 0 && (
            <>
              <Heading size={{ initial: '4', md: '5' }}>Payment method</Heading>

              <form.Field name="paymentMethod">
                {(field) => (
                  <Accordion.Root
                    className={classes.methods}
                    value={field.state.value}
                    onValueChange={field.handleChange as (value: string) => void}
                    type="single"
                  >
                    {PAYMENT_METHODS.map(({ id, title, Component }) => (
                      <PaymentDetails
                        key={id}
                        method={id}
                        expanded={field.state.value === id}
                        onExpandedChange={(expanded) => {
                          if (expanded) {
                            field.handleChange(id);
                          }
                        }}
                      >
                        <Component
                          amount={remainingAmount}
                          active={field.state.value === id}
                          handle={(v) => {
                            if (field.state.value === id && !!v) {
                              payment.current = v;
                            }
                          }}
                        />
                      </PaymentDetails>
                    ))}
                  </Accordion.Root>
                )}
              </form.Field>
            </>
          )}
        </Text>
      </Flex>
      <Buttons />
    </form>
  );
};

type PaymentDetailsProps = PropsWithChildren<{
  method: PaymentMethod;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}>;

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  method,
  expanded,
  onExpandedChange,
  children,
}) => {
  return (
    <Accordion.Item value={method}>
      <Accordion.Header className={classes.methodHeader}>
        <Checkbox
          className={classes.methodCheckbox}
          checked={expanded}
          onCheckedChange={(checked) => onExpandedChange(!!checked)}
        />
        <Accordion.Trigger>
          <Text>{PAYMENT_LABELS[method]}</Text>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content>
        <Text as="div" size="3">
          {children}
        </Text>
      </Accordion.Content>
    </Accordion.Item>
  );
};
