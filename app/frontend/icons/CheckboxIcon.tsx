import { AccessibleIcon } from '@radix-ui/themes';
import clsx from 'clsx';
import { forwardRef } from 'react';

type CheckboxIconProps = {
  className?: string;
  indeterminate?: boolean;
};

const CheckboxIcon = forwardRef<SVGSVGElement, CheckboxIconProps>(
  ({ className, indeterminate = false, ...props }, ref) => {
    return (
      <AccessibleIcon label="Checkbox">
        <svg
          ref={ref}
          role="presentation"
          className={clsx('icon', className)}
          data-variant="outline"
          data-size="medium"
          data-icon="Checkbox"
          viewBox="0 0 20 20"
          {...props}
        >
          <path
            data-component="checked"
            d="M16.667,5L7.5,14.167L3.333,10"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
          />
          <path
            data-component="indeterminate"
            d="M4,10h12"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
          />
        </svg>
      </AccessibleIcon>
    );
  }
);

CheckboxIcon.displayName = 'CheckboxIcon';

export default CheckboxIcon;
