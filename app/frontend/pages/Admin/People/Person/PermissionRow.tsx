import Checkbox from '@/atoms/Checkbox';
import { Permission, PersonQuery } from '@/graphql/types';

import { CheckboxState } from './usePermissionTree';

type PermissionProps = {
  permission: PersonQuery['permissions'][number];
  checkboxStates: Map<Permission, CheckboxState>;
  disabled: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const PermissionRow: React.FC<PermissionProps> = ({
  permission,
  checkboxStates,
  disabled,
  onChange,
}) => {
  const state = checkboxStates.get(permission.id) || 'unchecked';

  return (
    <div className="permission">
      <label className="permission__label">
        <Checkbox
          name="permissions"
          value={permission.id}
          checked={state === 'checked'}
          indeterminate={state === 'indeterminate'}
          disabled={disabled || undefined}
          onChange={onChange}
        />
        <div className="permission__name">{permission.label}</div>
      </label>
      <div className="permission__children">
        {permission.children?.map((child) => (
          <PermissionRow
            key={child.id}
            permission={child as PermissionProps['permission']}
            checkboxStates={checkboxStates}
            disabled={disabled}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
};

export default PermissionRow;
