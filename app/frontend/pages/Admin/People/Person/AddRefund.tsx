import { useState } from 'react';

import Button from '@/atoms/Button';
import Input from '@/atoms/Input';
import {
  RegistrationPaymentFragmentDoc,
  RegistrationStatusQuery,
  useAddRefundMutation,
} from '@/graphql/types';
import Labelled from '@/helpers/Labelled';

type AddRefundForm = HTMLFormElement & {
  amount: HTMLInputElement;
};

type AddRefundProps = {
  registration: RegistrationStatusQuery['registration'];
};

const AddRefund: React.FC<AddRefundProps> = ({ registration }) => {
  const [addRefund] = useAddRefundMutation();

  const [disabled, setDisabled] = useState(false);

  const submit = (e: React.FormEvent<AddRefundForm>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!registration) return;

    setDisabled(true);
    addRefund({
      variables: {
        registrationId: registration.id,
        amount: e.currentTarget.amount.valueAsNumber * -100,
      },
      update: (cache, { data }) => {
        const payment = data?.addPayment?.payment;
        if (!payment) return;

        const ref = cache.writeFragment({
          id: cache.identify(payment),
          fragment: RegistrationPaymentFragmentDoc,
          data: payment,
        });

        cache.modify({
          id: cache.identify(registration),
          fields: {
            payments: (existing) => [...existing, ref],
          },
        });
      },
    }).then(() => setDisabled(false));
  };

  return (
    <form className="add-payment" onSubmit={submit}>
      <h3>Add refund</h3>
      <Labelled name="amount" label="$">
        <Input type="number" name="amount" id="amount" min={1} defaultValue={50} htmlSize={3} />
      </Labelled>
      <Button type="submit" text="Add refund" disabled={disabled || !registration || undefined} />
    </form>
  );
};

export default AddRefund;
