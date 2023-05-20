import { useEffect } from 'react';
import { isEqual } from 'lodash-es';

import { Permission, useUpdatePermissionsMutation } from '@/graphql/types';
import { useAuthentication } from '@/organisms/Authentication/AuthenticationProvider';

import { usePermissions, usePerson } from './Context';
import PermissionRow from './PermissionRow';
import usePermissionTree from './usePermissionTree';

const Permissions: React.FC = () => {
  const person = usePerson();
  const permissions = usePermissions();

  const { user } = useAuthentication();

  const {
    checkboxStates,
    permissions: newValue,
    add,
    remove,
    enabled,
  } = usePermissionTree(person?.user?.permissions || [], permissions, user);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;

    if (checked) {
      add(value as Permission);
    } else {
      remove(value as Permission);
    }
  };

  const [updatePermissions] = useUpdatePermissionsMutation();

  useEffect(() => {
    if (!person?.user?.id || isEqual(newValue, person.user.permissions)) return;

    updatePermissions({
      variables: {
        id: person.user.id,
        permissions: newValue,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateUser: {
          __typename: 'UpdateUserPayload',
          user: {
            __typename: 'User',
            id: person.user.id,
            permissions: newValue,
          },
        },
      },
    });
  }, [newValue, person?.user, updatePermissions]);

  return (
    <section>
      <header>
        <h3>Roles and permissions</h3>
        <p>What you can and can’t do around here</p>
      </header>
      <div>
        {permissions.map((permission) => (
          <PermissionRow
            key={permission.id}
            permission={permission}
            checkboxStates={checkboxStates}
            disabled={!enabled || user?.id === person?.user?.id}
            onChange={onChange}
          />
        ))}
      </div>
    </section>
  );
};

export default Permissions;
