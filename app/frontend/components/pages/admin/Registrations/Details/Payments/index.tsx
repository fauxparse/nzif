import { Money } from '@/components/atoms/Money';
import { FragmentOf } from '@/graphql';
import { PaymentState, PaymentType } from '@/graphql/types';
import { usePricing } from '@/services/Pricing';
import { Table, Text } from '@radix-ui/themes';
import { lowerCase, upperFirst } from 'lodash-es';
import { DateTime } from 'luxon';
import pluralize from 'pluralize';
import { useMemo } from 'react';
import { useRegistrationDetails } from '../RegistrationDetailsProvider';
import { RegistrationPaymentFragment } from '../queries';

import {
  PaymentStateProvider,
  PaymentStateSelect,
} from '../../../Payments/PaymentsList/PaymentStateSelect';
import { NewPaymentForm } from './NewPaymentForm.tsx';
import classes from './Payments.module.css';

type Payment = FragmentOf<typeof RegistrationPaymentFragment>;

export const Payments: React.FC = () => {
  const { registration, loading } = useRegistrationDetails();

  const count = useMemo(
    () => registration?.sessions?.flatMap((s) => s.slots)?.length ?? 0,
    [registration]
  );

  const payments = registration?.payments ?? [];

  const { basePrice, packageDiscount } = usePricing();

  const discount = registration?.donateDiscount ? 0 : packageDiscount(count);

  const paidByVoucher = payments.reduce(
    (acc, payment) =>
      acc +
      (payment.type === PaymentType.Voucher && payment.state === PaymentState.Approved
        ? payment.amount
        : 0),
    0
  );

  const paidOtherwise = payments.reduce(
    (acc, payment) =>
      acc +
      (payment.type !== PaymentType.Voucher && payment.state === PaymentState.Approved
        ? payment.amount
        : 0),
    0
  );

  const total = basePrice * count - discount;

  const remaining = Math.max(0, total - paidByVoucher) - paidOtherwise;

  if (!registration || loading) return null;

  return (
    <div className={classes.payments}>
      <Table.Root className={classes.table} variant="surface" size={{ initial: '2', sm: '3' }}>
        <Table.Body>
          <Table.Row>
            <Table.RowHeaderCell>{pluralize('workshop', count, true)}</Table.RowHeaderCell>
            <Table.Cell>
              @ <Money cents={basePrice} />
            </Table.Cell>
            <Table.Cell />
            <Table.Cell>
              <Money cents={basePrice * count} />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.RowHeaderCell>Package discount</Table.RowHeaderCell>
            <Table.Cell>{registration?.donateDiscount && '(Donated)'}</Table.Cell>
            <Table.Cell />
            <Table.Cell>
              <Money cents={discount} />
            </Table.Cell>
          </Table.Row>
          <Table.Row className={classes.highlightRow}>
            <Table.RowHeaderCell>Total</Table.RowHeaderCell>
            <Table.Cell />
            <Table.Cell />
            <Table.Cell>
              <Money cents={basePrice * count - discount} />
            </Table.Cell>
          </Table.Row>
          {registration?.payments?.map((payment) => (
            <PaymentStateProvider key={payment.id}>
              <Table.Row key={payment.id}>
                <Table.RowHeaderCell>
                  {upperFirst(lowerCase(payment.type.replace(/payment$/i, '')))}
                  <Text as="div" size="2" color="gray">
                    {payment.createdAt.toLocaleString(DateTime.DATE_MED)}
                  </Text>
                </Table.RowHeaderCell>
                <Table.Cell>
                  <PaymentStateSelect payment={payment} />
                </Table.Cell>
                <Table.Cell>
                  <Money cents={-payment.amount} />
                </Table.Cell>
                <Table.Cell />
              </Table.Row>
            </PaymentStateProvider>
          ))}
          <Table.Row className={classes.highlightRow}>
            <Table.RowHeaderCell>
              <Text size="4">{remaining >= 0 ? 'Amount due' : 'Refund due'}</Text>
            </Table.RowHeaderCell>
            <Table.Cell />
            <Table.Cell />
            <Table.Cell>
              <Text size="4">
                <Money cents={Math.abs(remaining)} />
              </Text>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
      <NewPaymentForm />
    </div>
  );
};
