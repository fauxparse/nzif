import { ReactNode } from 'react';
import { isString } from 'lodash-es';

import { useRegistrationContext } from '../RegistrationContext';
import useCartCalculator from '../useCartCalculator';
import CopyToClipboard from '@/atoms/CopyToClipboard';
import Money from '@/atoms/Money';
import { usePromiseInternetBankingPaymentMutation } from '@/graphql/types';

const Copyable = ({ children, as }: { children: ReactNode; as?: string }) => (
  <>
    <dd>
      <span>{children}</span>
    </dd>
    <dd>
      <CopyToClipboard text={as || (isString(children) ? children : '')} />
    </dd>
  </>
);

type InternetBankingProps = {
  next: () => void;
};

const InternetBanking: React.FC<InternetBankingProps> = ({ next }) => {
  const { registration, festival, setBusy } = useRegistrationContext();
  const { outstanding } = useCartCalculator(registration, festival);

  const [promiseInternetBankingPayment] = usePromiseInternetBankingPaymentMutation();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setBusy(true);
    promiseInternetBankingPayment({
      variables: { registrationId: registration.id, amount: outstanding },
    }).then(() => {
      setBusy(false);
      next();
    });
  };

  return (
    <form className="internet-banking" id="registration-form" onSubmit={submit}>
      <p>Please make a payment to the following account:</p>
      <dl className="internet-banking__account">
        <dt>Amount</dt>
        <Copyable as={String(outstanding / 100.0)}>
          <Money cents={outstanding} includeCurrency />
        </Copyable>
        <dt>Account name</dt>
        <Copyable>New Zealand Improvisation Trust</Copyable>
        <dt>Account number</dt>
        <Copyable>38-9016-0773754-00</Copyable>
        <dt>Reference</dt>
        <Copyable>
          {registration.user?.profile?.name?.toLocaleUpperCase().substring(0, 12)}
        </Copyable>
        <dt>Code</dt>
        <Copyable>NZIF2023</Copyable>
      </dl>

      <p>For overseas payments, you may need the following additional details:</p>
      <dl className="internet-banking__account">
        <dt>SWIFT code</dt>
        <dd>KIWINZ22</dd>
        <dt>Branch address</dt>
        <dd>
          Kiwibank Limited
          <br />
          Level 9, 20 Customhouse Quay
          <br />
          Wellington, 6011
          <br />
          New Zealand
        </dd>
      </dl>
    </form>
  );
};

export default InternetBanking;
