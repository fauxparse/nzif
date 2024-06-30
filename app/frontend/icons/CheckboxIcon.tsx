import { Box, BoxProps } from '@mantine/core';
import clsx from 'clsx';

type CheckboxIconProps = Omit<BoxProps, 'className'> & {
  className: string;
  indeterminate?: boolean;
};

const CheckboxIcon: React.FC<CheckboxIconProps> = ({
  className,
  indeterminate = false,
  ...props
}) => {
  return (
    <Box
      className={clsx('icon', className)}
      data-variant="outline"
      data-size="medium"
      data-icon="Checkbox"
      component="svg"
      role="img"
      aria-description="Checkbox"
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
    </Box>
  );
};

CheckboxIcon.displayName = 'CheckboxIcon';

export default CheckboxIcon;
