import pluralize from 'pluralize';

import Money from '@/atoms/Money';
import { RegistrationStatusQuery } from '@/graphql/types';
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

export const PaymentsTable: React.FC<PaymentsTableProps> = ({ registration, festival }) => {
  const registrationPhase = festival.registrationPhase;

  const { base, count, value, discount, total, outstanding, refundDue } = useCartCalculator(
    registration,
    festival
  );

  return (
    <table className="payments-table">
      <tbody>
        <tr>
          <th>{registration.completedAt?.toFormat('d MMM')}</th>
          <td>
            {pluralize('workshop', count, true)}
            {' @ '}
            <Money cents={base} />
          </td>
          <td className="payment-amount">
            <Money cents={value} />
          </td>
        </tr>
        {count > 1 && (
          <tr>
            <th></th>
            <td>Discount</td>
            <td className="payment-amount">
              <Money cents={-discount} />
            </td>
          </tr>
        )}
        <tr>
          <th></th>
          <td>Subtotal</td>
          <td className="payment-amount">
            <Money cents={total} />
          </td>
        </tr>
      </tbody>
      <tbody>
        {(registration?.payments || []).map((payment) => (
          <tr key={payment.id} className="payment">
            <th>{payment.createdAt.toFormat('d MMM')}</th>
            <td>
              <strong>{PAYMENT_TYPE_LABELS[payment.__typename]}</strong>
              {payment.__typename === 'Voucher' && (
                <div>{pluralize('workshop', payment.workshops, true)}</div>
              )}
            </td>
            <td className="payment__amount">
              <Money cents={-payment.amount} />
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        {refundDue > 0 ? (
          <tr>
            <th></th>
            <td>Refund due</td>
            <td className="payment-amount">
              <Money cents={refundDue} />
            </td>
          </tr>
        ) : (
          <tr>
            <th></th>
            <td>Outstanding</td>
            <td className="payment-amount">
              <Money cents={outstanding} />
            </td>
          </tr>
        )}
      </tfoot>
    </table>
  );
};

export default PaymentsTable;
