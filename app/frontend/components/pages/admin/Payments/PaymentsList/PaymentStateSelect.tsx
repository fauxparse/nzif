import { FragmentOf } from '@/graphql';
import { PaymentState } from '@/graphql/types';
import { useMutation } from '@apollo/client';
import { Select } from '@radix-ui/themes';
import { PropsWithChildren, createContext, useContext } from 'react';
import { PaymentsRowFragment, UpdatePaymentStateMutation } from './queries';

type Payment = Omit<FragmentOf<typeof PaymentsRowFragment>, 'registration' | 'reference'>;

type PaymentStateSelectProps = {
  payment: Payment;
};

type PaymentStateContext = {
  changeState: (payment: Payment, status: PaymentState) => void;
};

const PaymentStateContext = createContext<PaymentStateContext>({
  changeState: () => {
    throw new Error('PaymentStateContext not provided');
  },
});

export const PaymentStateProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [updatePaymentState] = useMutation(UpdatePaymentStateMutation);

  const changeState = (payment: Payment, state: PaymentState) => {
    updatePaymentState({
      variables: { id: payment.id, state },
      optimisticResponse: {
        updatePayment: {
          payment: {
            ...payment,
            state,
          },
        },
      },
    });
  };
  return (
    <PaymentStateContext.Provider value={{ changeState }}>{children}</PaymentStateContext.Provider>
  );
};

export const usePaymentState = () => useContext(PaymentStateContext);

const COLORS: Record<PaymentState, 'green' | 'yellow' | 'red'> = {
  [PaymentState.Approved]: 'green',
  [PaymentState.Pending]: 'yellow',
  [PaymentState.Cancelled]: 'red',
  [PaymentState.Failed]: 'red',
} as const;

export const PaymentStateSelect: React.FC<PaymentStateSelectProps> = ({ payment }) => {
  const { changeState } = usePaymentState();

  return (
    <Select.Root
      defaultValue={payment.state}
      onValueChange={(value: PaymentState) => changeState(payment, value)}
    >
      <Select.Trigger variant="soft" color={COLORS[payment.state]} style={{ minWidth: '6.5rem' }} />
      <Select.Content>
        {Object.entries(PaymentState).map(([key, value]) => (
          <Select.Item key={key} value={value}>
            {value}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};
