import { Permission } from '@/graphql/types';
import { isEmpty, memoize } from 'lodash-es';
import PERMISSIONS from '../../../../config/permissions.yml';
import { AuthenticatedUser } from './types';

type PermissionTree = {
  [key in Permission]?: PermissionNode;
};

type PermissionNode = {
  description: string;
  implies?: PermissionTree;
};

const unnestedPermissions = memoize(() => {
  const parents: Map<Permission, Permission[]> = new Map();
  const stack: PermissionTree[] = [PERMISSIONS];

  while (stack.length > 0) {
    const permissions = stack.shift();
    for (const id in permissions) {
      const permission = permissions[id as Permission];
      if (!permission || isEmpty(permission?.implies)) continue;
      stack.push(permission.implies);
      for (const child in permission.implies) {
        const chain = parents.get(id as Permission) || [];
        parents.set(child as Permission, [...chain, id as Permission]);
      }
    }
  }

  return parents;
});

export const hasPermission = (permission: Permission, user: AuthenticatedUser | null) => {
  if (!user || isEmpty(user?.permissions)) return false;

  if (user.permissions.includes(permission) || user.permissions.includes(Permission.Admin))
    return true;

  return user.permissions.some(
    (p) =>
      unnestedPermissions()
        .get(p as Permission)
        ?.includes(permission) ?? false
  );
};
