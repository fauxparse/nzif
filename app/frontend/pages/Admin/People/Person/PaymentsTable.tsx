import { useState } from 'react';
import pluralize from 'pluralize';

import Button from '@/atoms/Button';
import Icon, { IconName } from '@/atoms/Icon';
import Money from '@/atoms/Money';
import {
  PaymentState,
  RegistrationStatusQuery,
  useApprovePaymentMutation,
  useCancelPaymentMutation,
} from '@/graphql/types';
import Menu from '@/molecules/Menu';
import Popover from '@/molecules/Popover';
import useCartCalculator from '@/pages/Public/Registration/useCartCalculator';

type Registration = RegistrationStatusQuery['registration'];
type Payment = Registration['payments'][number];
type Festival = RegistrationStatusQuery['festival'];

type PaymentsTableProps = {
  registration: Registration;
  festival: Festival;
};

const PAYMENT_TYPE_LABELS: { [key in Payment['__typename']]: string } = {
  InternetBankingPayment: 'Internet banking',
  CreditCardPayment: 'Credit card',
  Voucher: 'Voucher',
} as const;

const PAYMENT_STATE_ICONS: { [key in PaymentState]: IconName } = {
  [PaymentState.Approved]: 'check',
  [PaymentState.Cancelled]: 'cancel',
  [PaymentState.Failed]: 'alert',
  [PaymentState.Pending]: 'moreHorizontal',
} as const;

export const PaymentsTable: React.FC<PaymentsTableProps> = ({ registration, festival }) => {
  const [selected, setSelected] = useState<Payment | null>(null);

  const [popupTrigger, setPopupTrigger] = useState<HTMLButtonElement | null>(null);

  const moreClicked = (e: React.MouseEvent<HTMLButtonElement>, payment: Payment) => {
    setPopupTrigger(e.currentTarget);
    setSelected(payment);
  };

  const closePopup = () => setSelected(null);

  const { base, count, value, discount, total, outstanding, refundDue } = useCartCalculator(
    registration,
    festival
  );

  const [approvePayment] = useApprovePaymentMutation();

  const approveClicked = (payment: Payment) => {
    approvePayment({
      variables: { id: payment.id },
      optimisticResponse: {
        __typename: 'Mutation',
        approvePayment: {
          __typename: 'ApprovePaymentPayload',
          payment: {
            ...payment,
            state: PaymentState.Approved,
          },
        },
      },
    });
    closePopup();
  };

  const [cancelPayment] = useCancelPaymentMutation();

  const cancelClicked = (payment: Payment) => {
    cancelPayment({
      variables: { id: payment.id },
      optimisticResponse: {
        __typename: 'Mutation',
        cancelPayment: {
          __typename: 'CancelPaymentPayload',
          payment: {
            ...payment,
            state: PaymentState.Cancelled,
          },
        },
      },
      update: (cache) => {
        cache.evict({ id: cache.identify(payment) });
      },
    });
    closePopup();
  };

  return (
    <>
      <table className="payments-table">
        <tbody>
          <tr>
            <td></td>
            <th>{registration.completedAt?.toFormat('d MMM')}</th>
            <td>
              {pluralize('workshop', count, true)}
              {' @ '}
              <Money cents={base} />
            </td>
            <td className="payment__amount">
              <Money cents={value} />
            </td>
            <td></td>
          </tr>
          {count > 1 && (
            <tr>
              <td></td>
              <td></td>
              <th>Discount</th>
              <td className="payment__amount">
                <Money cents={-discount} />
              </td>
              <td></td>
            </tr>
          )}
          <tr>
            <td></td>
            <td></td>
            <th>Subtotal</th>
            <td className="payment__amount">
              <Money cents={total} />
            </td>
            <td></td>
          </tr>
        </tbody>
        <tbody>
          {(registration?.payments || []).map((payment) => (
            <tr key={payment.id} className="payment" data-state={payment.state.toLowerCase()}>
              <td>
                <Icon name={PAYMENT_STATE_ICONS[payment.state]} />
              </td>
              <th>{payment.createdAt?.toFormat('d MMM')}</th>
              <td>
                <strong>{PAYMENT_TYPE_LABELS[payment.__typename]}</strong>
                {payment.__typename === 'Voucher' && (
                  <div>{pluralize('workshop', payment.workshops, true)}</div>
                )}
              </td>
              <td className="payment__amount">
                <Money cents={-payment.amount} />
              </td>
              <td>
                <Button
                  ghost
                  icon="moreVertical"
                  aria-label="Actions for payment"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => moreClicked(e, payment)}
                />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          {refundDue > 0 ? (
            <tr>
              <td></td>
              <td></td>
              <th>Refund due</th>
              <td className="payment__amount">
                <Money cents={refundDue} />
              </td>
              <td></td>
            </tr>
          ) : (
            <tr>
              <td></td>
              <td></td>
              <th>Outstanding</th>
              <td className="payment__amount">
                <Money cents={outstanding} />
              </td>
              <td></td>
            </tr>
          )}
        </tfoot>
      </table>
      {popupTrigger && (
        <Popover reference={popupTrigger} open={!!selected} onOpenChange={closePopup}>
          {selected && (
            <Menu>
              {selected?.state !== PaymentState.Approved && (
                <Menu.Item label="Approve" icon="check" onClick={() => approveClicked(selected)} />
              )}
              {selected?.state !== PaymentState.Cancelled && (
                <Menu.Item label="Cancel" icon="cancel" onClick={() => cancelClicked(selected)} />
              )}
            </Menu>
          )}
        </Popover>
      )}
    </>
  );
};

export default PaymentsTable;
