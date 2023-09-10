import { IconName } from '@/atoms/Icon';
import { PaymentDetailsFragment, PaymentState } from '@/graphql/types';
import { SegmentedOption } from '@/molecules/Segmented/Segmented.types';

export type PaymentMethod = PaymentDetailsFragment['__typename'];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CreditCardPayment: 'Stripe',
  InternetBankingPayment: 'Bank',
  Voucher: 'Voucher',
};

export const PAYMENT_METHOD_ICONS: Record<PaymentMethod, IconName> = {
  CreditCardPayment: 'creditCard',
  InternetBankingPayment: 'bank',
  Voucher: 'voucher',
};

export const PAYMENT_METHOD_OPTIONS: SegmentedOption<PaymentMethod>[] = (
  Object.entries(PAYMENT_METHOD_LABELS) as [PaymentMethod, string][]
).map(([id, label]) => ({ id, label, icon: PAYMENT_METHOD_ICONS[id] }));

export const PAYMENT_STATE_ICONS: Record<PaymentState, IconName> = {
  [PaymentState.Approved]: 'check',
  [PaymentState.Cancelled]: 'cancel',
  [PaymentState.Failed]: 'alert',
  [PaymentState.Pending]: 'pending',
};

export const PAYMENT_STATE_OPTIONS: SegmentedOption<PaymentState>[] = Object.entries(
  PaymentState
).map(([label, id]) => ({ id, label, icon: PAYMENT_STATE_ICONS[id] }));
