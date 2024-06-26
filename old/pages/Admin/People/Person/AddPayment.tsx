import { useState } from 'react';

import Button from '@/atoms/Button';
import Input from '@/atoms/Input';
import {
  RegistrationPaymentFragmentDoc,
  RegistrationStatusQuery,
  useAddPaymentMutation,
} from '@/graphql/types';
import Labelled from '@/helpers/Labelled';

type AddPaymentForm = HTMLFormElement & {
  amount: HTMLInputElement;
};

type AddPaymentProps = {
  registration: RegistrationStatusQuery['registration'];
};

const AddPayment: React.FC<AddPaymentProps> = ({ registration }) => {
  const [addPayment] = useAddPaymentMutation();

  const [disabled, setDisabled] = useState(false);

  const submit = (e: React.FormEvent<AddPaymentForm>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!registration) return;

    setDisabled(true);
    addPayment({
      variables: {
        registrationId: registration.id,
        amount: e.currentTarget.amount.valueAsNumber * 100,
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
      <h3>Add payment</h3>
      <Labelled name="amount" label="$">
        <Input type="number" name="amount" id="amount" min={1} defaultValue={50} htmlSize={3} />
      </Labelled>
      <Button type="submit" text="Add payment" disabled={disabled || !registration || undefined} />
    </form>
  );
};

export default AddPayment;
