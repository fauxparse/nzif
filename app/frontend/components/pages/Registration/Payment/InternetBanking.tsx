import { Money } from '@/components/atoms/Money';
import { useToast } from '@/components/molecules/Toast';
import { useFestival } from '@/hooks/useFestival';
import CopyIcon from '@/icons/CopyIcon';
import { useRegistration } from '@/services/Registration';
import { DataList, Flex, IconButton } from '@radix-ui/themes';
import React, { PropsWithChildren, useImperativeHandle } from 'react';
import { PaymentMethod, PaymentMethodProps } from './types';

export const InternetBanking: React.FC<PaymentMethodProps> = ({ amount, handle }) => {
  const festival = useFestival();

  const { registration } = useRegistration();

  useImperativeHandle(handle, () => ({
    method: 'InternetBankingPayment' as PaymentMethod,
    submit: () => Promise.resolve(true),
  }));

  return (
    <>
      <p>Please make a payment to the following account:</p>
      <DataList.Root>
        <DataList.Item align="center">
          <DataList.Label>Amount</DataList.Label>
          <DataList.Value>
            <Copyable as={String(amount / 100)}>
              <Money cents={amount} includeCurrency />
            </Copyable>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item align="center">
          <DataList.Label>Account name</DataList.Label>
          <DataList.Value>
            <Copyable>New Zealand Improvisation Trust</Copyable>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item align="center">
          <DataList.Label>Account number</DataList.Label>
          <DataList.Value>
            <Copyable>38-9016-0773754-00</Copyable>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item align="center">
          <DataList.Label>Reference</DataList.Label>
          <DataList.Value>
            <Copyable>
              {registration?.user?.profile?.name?.toLocaleUpperCase().substring(0, 12)}
            </Copyable>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item align="center">
          <DataList.Label>Code</DataList.Label>
          <DataList.Value>
            <Copyable>NZIF{festival.id}</Copyable>
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>

      <p>For overseas payments, you may need the following additional details:</p>
      <DataList.Root>
        <DataList.Item align="center">
          <DataList.Label>SWIFT code</DataList.Label>
          <DataList.Value>
            <Copyable>KIWINZ22</Copyable>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>Branch address</DataList.Label>
          <DataList.Value>
            Kiwibank Limited
            <br />
            Level 9, 20 Customhouse Quay
            <br />
            Wellington, 6011
            <br />
            New Zealand
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>
    </>
  );
};

const Copyable: React.FC<PropsWithChildren<{ as?: string }>> = ({ children, as }) => {
  const { notify } = useToast();

  const copy = () => {
    navigator.clipboard.writeText(as ?? String(children));
    notify({ description: 'Copied to clipboard' });
  };

  return (
    <Flex align="center" gap="4">
      {children}{' '}
      <IconButton type="button" size="1" variant="ghost" color="gray" onClick={copy}>
        <CopyIcon />
      </IconButton>
    </Flex>
  );
};
