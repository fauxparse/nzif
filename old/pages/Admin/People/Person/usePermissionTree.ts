import { isEqual, sortBy } from 'lodash-es';
import { useEffect, useMemo, useReducer } from 'react';

import { CurrentUserQuery, Permission, PermissionDefinition } from '@/graphql/types';

export type CheckboxState = 'checked' | 'unchecked' | 'indeterminate';

type Action =
  | { type: 'reset'; permissions: Permission[] }
  | { type: 'add'; permission: Permission }
  | { type: 'remove'; permission: Permission };

type State = {
  permissions: Set<Permission>;
};

const usePermissionTree = (
  set: Permission[],
  permissions: PermissionDefinition[],
  currentUser: CurrentUserQuery['user']
) => {
  const parents = useMemo(() => {
    const addParents = (
      map: Map<Permission, Permission[]>,
      permission: PermissionDefinition,
      parent: PermissionDefinition | null = null
    ) => {
      if (parent) map.set(permission.id, [...(map.get(parent.id) || []), parent.id]);
      for (const child of permission.children || []) addParents(map, child, permission);
      return map;
    };
    return permissions.reduce(
      (map, permission) => addParents(map, permission),
      new Map<Permission, Permission[]>()
    );
  }, [permissions]);

  const children = useMemo(() => {
    const addChildren = (map: Map<Permission, Permission[]>, permission: PermissionDefinition) => {
      map.set(permission.id, permission.children?.map((child) => child.id) || []);
      for (const child of permission.children || []) addChildren(map, child);
      return map;
    };
    return permissions.reduce(
      (map, permission) => addChildren(map, permission),
      new Map<Permission, Permission[]>()
    );
  }, [permissions]);

  const descendants = useMemo(() => {
    const addDescendants = (
      map: Map<Permission, Permission[]>,
      permission: PermissionDefinition
    ) => {
      for (const child of permission.children || []) addDescendants(map, child);
      map.set(
        permission.id,
        permission.children?.reduce(
          (acc, child) => acc.concat([child.id, ...(map.get(child.id) || [])]),
          [] as Permission[]
        ) || []
      );
      return map;
    };

    return permissions.reduce(
      (map, permission) => addDescendants(map, permission),
      new Map<Permission, Permission[]>()
    );
  }, [permissions]);

  const flattened = useMemo(() => {
    const flatten = (permission: PermissionDefinition): Permission[] => [
      permission.id,
      ...(permission.children?.flatMap(flatten) || []),
    ];
    return permissions.flatMap(flatten);
  }, [permissions]);

  const [state, dispatch] = useReducer(
    (state: State, action: Action) => {
      switch (action.type) {
        case 'reset': {
          const oldSet = sortBy(Array.from(state.permissions));
          const newSet = sortBy(action.permissions);
          if (isEqual(oldSet, newSet)) return state;
          return { ...state, permissions: new Set(action.permissions) };
        }
        case 'add': {
          const newSet = new Set(state.permissions);
          newSet.add(action.permission);
          for (const p of descendants.get(action.permission) || []) newSet.delete(p);
          for (const p of [...(parents.get(action.permission) || [])].reverse()) {
            if (children.get(p)?.every((d) => newSet.has(d))) {
              for (const d of descendants.get(p) || []) newSet.delete(d);
              newSet.add(p);
            }
          }
          return { ...state, permissions: newSet };
        }
        case 'remove': {
          const newSet = new Set(state.permissions);
          const parent = [...(parents.get(action.permission) || [])]
            .reverse()
            .find((p) => newSet.has(p));
          if (parent) {
            newSet.delete(parent);
            for (const p of children.get(parent) || []) newSet.add(p);
            newSet.delete(action.permission);
          }
          for (const p of descendants.get(action.permission) || []) newSet.delete(p);
          newSet.delete(action.permission);
          return { ...state, permissions: newSet };
        }
      }
    },
    { permissions: new Set<Permission>(set) }
  );

  const checkboxStates = useMemo<Map<Permission, CheckboxState>>(() => {
    return flattened.reduce((map, permission) => {
      if (state.permissions.has(permission)) {
        map.set(permission, 'checked');
      } else if (parents.get(permission)?.some((p) => state.permissions.has(p))) {
        map.set(permission, 'checked');
      } else if (descendants.get(permission)?.some((p) => state.permissions.has(p))) {
        map.set(permission, 'indeterminate');
      } else {
        map.set(permission, 'unchecked');
      }
      return map;
    }, new Map());
  }, [flattened, state.permissions, descendants, parents]);

  const add = (permission: Permission) => dispatch({ type: 'add', permission });
  const remove = (permission: Permission) => dispatch({ type: 'remove', permission });
  const reset = (permissions: Permission[]) => dispatch({ type: 'reset', permissions });

  const array = useMemo(() => Array.from(state.permissions), [state.permissions]);

  const enabled = useMemo(
    () =>
      (parents.get(Permission.Permissions) || []).some((p) => currentUser?.permissions.includes(p)),
    [parents, currentUser?.permissions]
  );

  useEffect(() => {
    reset(set);
  }, [reset, set]);

  return {
    permissions: array,
    checkboxStates,
    add,
    remove,
    reset,
    enabled,
  };
};

export default usePermissionTree;
