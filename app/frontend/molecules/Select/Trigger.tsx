import clsx from 'clsx';
import { forwardRef } from 'react';

import Button, { ButtonProps } from '@/atoms/Button';
import Icon from '@/atoms/Icon';

import { useSelectContext } from './Context';

const Trigger = forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...props }, ref) => {
  const { open, label, placeholder } = useSelectContext();

  return (
    <Button
      ref={ref}
      className={clsx('select', className)}
      aria-expanded={open}
      text={label || placeholder}
      {...props}
    >
      <Icon className="select__chevron" name="chevronDown" />
    </Button>
  );
});

Trigger.displayName = 'Select.Trigger';

export default Trigger;
