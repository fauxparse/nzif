import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import Button from '../../../../atoms/Button';
import { UserAttributes, useUpdateUserMutation } from '../../../../graphql/types';
import EditableField from '../../../../molecules/EditableField';

import useUserContext from './useUserContext';

type UserForm = HTMLFormElement & {
  name: HTMLInputElement;
  email: HTMLInputElement;
};

const Edit: React.FC = () => {
  const { user } = useUserContext();

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [updateUser, { error }] = useUpdateUserMutation();

  const [dirty, setDirty] = useState<Map<keyof UserAttributes, boolean>>(new Map());

  const save = (event: React.FormEvent<UserForm>) => {
    event.preventDefault();

    if (!user) return;

    const { name, email } = event.currentTarget;

    const attributes = {
      name: name.value,
      email: email.value,
    };

    updateUser({
      variables: { id: user?.id, attributes: attributes as UserAttributes },
      update: () => setDirty(new Map()),
    });
  };

  useEffect(() => {
    if (error) {
      setErrors((current) => ({
        ...current,
        ...(error.graphQLErrors[0].extensions.errors as Record<string, string[]>),
      }));
    }
  }, [error]);

  const updateField = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const name = e.target.name as keyof UserAttributes;
    const value = e.target.value;
    setDirty((current) => new Map(current).set(name, user[name] !== value));
  };

  const isDirty = Array.from(dirty.values()).some((value) => value);

  return (
    <>
      <form id="edit-user" className="edit-user form inset two-columns" onSubmit={save}>
        <div className="form">
          <fieldset>
            <EditableField
              as={motion.input}
              layout
              label="Name"
              name="name"
              id="name"
              required
              defaultValue={user?.name}
              autoSelect
              autoComplete="off"
              errors={errors || undefined}
              onInput={updateField}
            />
            <EditableField
              as={motion.input}
              layout
              label="Email"
              type="email"
              name="email"
              id="email"
              required
              defaultValue={user?.email}
              autoSelect
              autoComplete="off"
              onInput={updateField}
            />
          </fieldset>
          <footer className="form__footer">
            <Button
              primary
              form="edit-user"
              type="submit"
              text="Save changes"
              disabled={!isDirty || undefined}
            />
          </footer>
        </div>
      </form>
    </>
  );
};

export default Edit;
