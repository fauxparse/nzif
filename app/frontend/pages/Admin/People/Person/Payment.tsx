import { useTypedParams } from 'react-router-typesafe-routes/dom';

import { RegistrationStatusQuery, useRegistrationStatusQuery } from '@/graphql/types';
import { ROUTES } from '@/Routes';

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
      <aside>{registration && <AddVoucher registration={registration} />}</aside>
    </div>
  );
};

Component.displayName = 'Registration.Payment';
