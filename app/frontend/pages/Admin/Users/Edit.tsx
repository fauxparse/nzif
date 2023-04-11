import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import Button from '../../../atoms/Button';
import { useEditUserQuery, UserAttributes, useUpdateUserMutation } from '../../../graphql/types';
import EditableField from '../../../molecules/EditableField';
import Icon from '../../../atoms/Icon';

type UserForm = HTMLFormElement & {
  name: HTMLInputElement;
  email: HTMLInputElement;
};

const Edit: React.FC = () => {
  const { id } = useParams<{ id: string }>() as { id: string };

  const { loading, data } = useEditUserQuery({ variables: { id } });

  const { user } = data || {};

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [updateUser, { loading: updating, error }] = useUpdateUserMutation();

  const [dirty, setDirty] = useState<Map<keyof UserAttributes, boolean>>(new Map());

  const save = (event: React.FormEvent<UserForm>) => {
    event.preventDefault();

    const { name, email } = event.currentTarget;

    const attributes = {
      name: name.value,
      email: email.value,
    };

    updateUser({
      variables: { id, attributes: attributes as UserAttributes },
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
    <div className="inset two-columns">
      <header>
        <div className="breadcrumbs">
          <Link to="/admin">Admin</Link>
          <Icon name="chevronRight" />
          <Link to="/admin/users">Users</Link>
        </div>
        <h1>{user?.name}</h1>
      </header>
      <form id="edit-user" className="edit-user form" onSubmit={save}>
        <fieldset disabled={loading || undefined}>
          <EditableField
            as={motion.input}
            layout
            label="Name"
            name="name"
            id="name"
            required
            defaultValue={user?.name}
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
            autoComplete="off"
            onInput={updateField}
          />
        </fieldset>
      </form>
      <aside>
        <Button
          primary
          form="edit-user"
          type="submit"
          text="Save changes"
          disabled={loading || !isDirty || undefined}
        />
      </aside>
    </div>
  );
};

export default Edit;
