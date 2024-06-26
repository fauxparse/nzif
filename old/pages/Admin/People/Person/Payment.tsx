import { useTypedParams } from 'react-router-typesafe-routes/dom';

import { ROUTES } from '@/Routes';
import { useRegistrationStatusQuery } from '@/graphql/types';

import AddPayment from './AddPayment';
import AddRefund from './AddRefund';
import AddVoucher from './AddVoucher';
import PaymentsTable from './PaymentsTable';

export const Component: React.FC = () => {
  const { id } = useTypedParams(ROUTES.ADMIN.PERSON);
  const { data } = useRegistrationStatusQuery({ variables: { id } });

  const { registration = null, festival = null } = data || {};

  return (
    <div className="inset registration__payments">
      <div className="registration__payment-summary">
        {registration && festival && (
          <PaymentsTable registration={registration} festival={festival} />
        )}
      </div>
      {registration && (
        <aside>
          <AddVoucher registration={registration} />
          <AddPayment registration={registration} />
          <AddRefund registration={registration} />
        </aside>
      )}
    </div>
  );
};

Component.displayName = 'Registration.Payment';
