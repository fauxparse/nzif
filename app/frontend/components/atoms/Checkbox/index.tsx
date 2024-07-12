import CheckboxIcon from '@/icons/CheckboxIcon';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { ThemeProps } from '@radix-ui/themes';
import clsx from 'clsx';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

import classes from './Checkbox.module.css';

type CheckboxElement = React.ElementRef<typeof CheckboxPrimitive.Root>;

export type CheckboxProps = Omit<
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  'asChild' | 'color' | 'defaultValue' | 'children'
> & {
  color?: ThemeProps['accentColor'];
  size?: '1' | '2' | '3';
  variant?: 'surface' | 'soft';
};

export const Checkbox = forwardRef<CheckboxElement, CheckboxProps>(
  (
    { className, color = 'accent', size = '2', variant = 'surface', ...checkboxProps },
    forwardedRef
  ) => {
    return (
      <CheckboxPrimitive.Root
        data-accent-color={color}
        data-size={size}
        data-variant={variant}
        {...checkboxProps}
        asChild={false}
        ref={forwardedRef}
        className={clsx(classes.root, className)}
      >
        <CheckboxPrimitive.Indicator
          asChild
          className="rt-BaseCheckboxIndicator rt-CheckboxIndicator"
          forceMount
        >
          <CheckboxIcon className={classes.icon} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  }
);

Checkbox.displayName = 'Checkbox';
