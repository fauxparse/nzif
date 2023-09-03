import { useState } from 'react';
import { useTypedParams } from 'react-router-typesafe-routes/dom';

import Button from '@/atoms/Button';
import Input from '@/atoms/Input';
import {
  RegistrationStatusQuery,
  useAddVoucherMutation,
  useRegistrationStatusQuery,
} from '@/graphql/types';
import Labelled from '@/helpers/Labelled';
import { ROUTES } from '@/Routes';

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
