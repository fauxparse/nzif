import { Ref } from 'react';

export type PaymentMethod = 'InternetBankingPayment' | 'CreditCardPayment';

export interface PaymentMethodHandle {
  method: PaymentMethod;
  submit: () => Promise<true | { error: string }>;
}

export type PaymentMethodProps = {
  amount: number;
  active?: boolean;
  handle: Ref<PaymentMethodHandle>;
};
