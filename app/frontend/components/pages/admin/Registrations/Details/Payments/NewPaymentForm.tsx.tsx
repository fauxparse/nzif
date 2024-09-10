import { PaymentState, PaymentType } from '@/graphql/types';
import PlusIcon from '@/icons/PlusIcon';
import { useMutation } from '@apollo/client';
import {
  Box,
  Button,
  Flex,
  Popover,
  SegmentedControl,
  Select,
  Text,
  TextField,
} from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import { lowerCase, upperFirst } from 'lodash-es';
import { DateTime } from 'luxon';
import { ReactNode, useState } from 'react';
import { AddPaymentMutation, RegistrationPaymentFragment } from '../queries';

import { useRegistrationDetails } from '../RegistrationDetailsProvider';
import classes from './Payments.module.css';

export const NewPaymentForm: React.FC = () => {
  const { registration } = useRegistrationDetails();

  const [addPayment] = useMutation(AddPaymentMutation);

  const form = useForm({
    defaultValues: {
      type: PaymentType.InternetBankingPayment,
      state: PaymentState.Pending,
      createdAt: DateTime.now(),
      amount: 0,
    },
    onSubmit: ({ value }) => {
      if (!registration) return;

      addPayment({
        variables: {
          registrationId: registration.id,
          ...value,
        },
        update: (cache, { data }) => {
          const payment = data?.addPayment?.payment;

          if (!payment) return;

          const ref = cache.writeFragment({
            id: cache.identify(payment),
            fragment: RegistrationPaymentFragment,
            data: payment,
          });

          cache.modify({
            id: cache.identify(registration),
            fields: {
              payments: (existingRefs) => [...existingRefs, ref],
            },
          });
        },
      });
    },
  });

  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <Button variant="outline" size="3">
          <PlusIcon />
          <Text>Add payment</Text>
        </Button>
      </Popover.Trigger>
      <Popover.Content maxWidth="800px" className={classes.addPayment}>
        <form
          style={{ display: 'contents' }}
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="type">
            {(field) => (
              <ResponsiveSelect
                value={field.state.value}
                values={Object.values(PaymentType)}
                onChange={field.handleChange}
              >
                {(type) => upperFirst(lowerCase(type.replace(/payment$/i, '')))}
              </ResponsiveSelect>
            )}
          </form.Field>
          <form.Field name="state">
            {(field) => (
              <ResponsiveSelect
                value={field.state.value}
                values={Object.values(PaymentState)}
                onChange={field.handleChange}
              >
                {(state) => upperFirst(lowerCase(state))}
              </ResponsiveSelect>
            )}
          </form.Field>
          <form.Field name="createdAt">
            {(field) => (
              <TextField.Root
                size="2"
                type="date"
                value={field.state.value.toISODate() ?? ''}
                onChange={(e) => {
                  const date = DateTime.fromISO(e.target.value);
                  if (date.isValid) field.handleChange(date);
                }}
              />
            )}
          </form.Field>
          <form.Field name="amount">
            {(field) => (
              <TextField.Root
                size="2"
                type="number"
                min={0}
                defaultValue={field.state.value / 100}
                onChange={(e) => {
                  const amount = e.currentTarget.valueAsNumber;
                  if (!Number.isNaN(amount)) field.handleChange(amount * 100);
                }}
              >
                <TextField.Slot>$</TextField.Slot>
              </TextField.Root>
            )}
          </form.Field>
          <Flex>
            <Button type="submit" variant="solid">
              <PlusIcon />
              Add Payment
            </Button>
          </Flex>
        </form>
      </Popover.Content>
    </Popover.Root>
  );
};

const ResponsiveSelect = <T extends string>({
  value,
  values,
  onChange,
  children,
}: { value: T; values: T[]; onChange: (value: T) => void; children: (value: T) => ReactNode }) => (
  <>
    <Box display={{ initial: 'none', md: 'block' }}>
      <SegmentedControl.Root value={value} onValueChange={(v) => onChange(v as T)}>
        {values.map((v) => (
          <SegmentedControl.Item key={v} value={v}>
            {children(v)}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
    </Box>
    <Flex display={{ initial: 'flex', md: 'none' }} style={{ justifyContent: 'stretch' }}>
      <Select.Root value={value} onValueChange={(v) => onChange(v as T)}>
        <Box asChild flexGrow="1">
          <Select.Trigger />
        </Box>
        <Select.Content>
          {values.map((v) => (
            <Select.Item key={v} value={v}>
              {children(v)}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  </>
);
