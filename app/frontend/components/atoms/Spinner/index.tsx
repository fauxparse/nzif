import { Box, BoxProps, Theme, ThemeProps } from '@radix-ui/themes';
import clsx from 'clsx';
import { PropsWithChildren } from 'react';

import classes from './Spinner.module.css';

export type SpinnerProps = PropsWithChildren<
  BoxProps & {
    loading?: boolean;
    color?: ThemeProps['accentColor'];
    size?: '1' | '2' | '3' | '4' | 'full';
  }
>;

export const Spinner = ({
  className,
  loading = true,
  color,
  size,
  children,
  ...props
}: SpinnerProps) => {
  if (loading) {
    return (
      <Theme accentColor={color}>
        <Box asChild className={clsx(classes.root, className)} data-size={size} {...props}>
          <svg viewBox="-50 -50 100 100">
            <title>Loading…</title>
            <g>
              <path d="M 0 -45a 45 45 0 0 1 0 90a 45 45 0 0 1 0 -90" pathLength={1} />
            </g>
          </svg>
        </Box>
      </Theme>
    );
  }

  return <>{children}</>;
};
