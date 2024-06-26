import { useState } from 'react';

import Button from '@/atoms/Button';
import Input from '@/atoms/Input';
import {
  RegistrationPaymentFragmentDoc,
  RegistrationStatusQuery,
  useAddVoucherMutation,
} from '@/graphql/types';
import Labelled from '@/helpers/Labelled';

type AddVoucherForm = HTMLFormElement & {
  workshopsCount: HTMLInputElement;
};

type AddVoucherProps = {
  registration: RegistrationStatusQuery['registration'];
};

const AddVoucher: React.FC<AddVoucherProps> = ({ registration }) => {
  const [addVoucher] = useAddVoucherMutation();

  const [disabled, setDisabled] = useState(false);

  const submit = (e: React.FormEvent<AddVoucherForm>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!registration) return;

    setDisabled(true);
    addVoucher({
      variables: {
        registrationId: registration.id,
        workshops: e.currentTarget.workshopsCount.valueAsNumber,
      },
      update: (cache, { data }) => {
        const payment = data?.addVoucher?.voucher;
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
    <form className="add-voucher" onSubmit={submit}>
      <h3>Add voucher</h3>
      <Labelled name="workshopsCount" label="Workshops">
        <Input
          type="number"
          name="workshopsCount"
          id="workshopsCount"
          min={1}
          defaultValue={5}
          htmlSize={1}
        />
      </Labelled>
      <Button type="submit" text="Add voucher" disabled={disabled || !registration || undefined} />
    </form>
  );
};

export default AddVoucher;
