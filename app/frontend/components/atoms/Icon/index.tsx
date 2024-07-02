import { AccessibleIcon, Box, BoxProps, TextProps } from '@radix-ui/themes';
import clsx from 'clsx';
import { isString } from 'lodash-es';
import { ReactNode, isValidElement } from 'react';

import classes from './Icon.module.css';

const DEFAULT_VARIANT = 'outline' as const;
const DEFAULT_SIZE = '2' as const;

type ViewBox = `${number} ${number} ${number} ${number}`;

type PathDefinition = string | ReactNode;

type PathDefinitions = {
  outline: PathDefinition;
} & Record<string, PathDefinition>;

type CreateIconOptions = {
  displayName: string;
  viewBox?: ViewBox;
  path: PathDefinition | PathDefinitions;
  title?: string;
};

export type IconSize = '1' | '2' | '3' | '4';

export type IconProps<T extends CreateIconOptions = CreateIconOptions> = Omit<BoxProps, 'title'> & {
  variant?: T extends { path: PathDefinitions } ? keyof T['path'] : typeof DEFAULT_VARIANT;
  title?: string;
  size?: IconSize;
  color?: TextProps['color'];
};

const hasMultipleVariants = (path: PathDefinition | PathDefinitions): path is PathDefinitions =>
  typeof path !== 'string' && !isValidElement(path);

export const createIcon = <const T extends CreateIconOptions>(options: T) =>
  Object.assign(
    ({ variant, size = DEFAULT_SIZE, title, className, color, ...props }: IconProps<T>) => {
      const path = hasMultipleVariants(options.path)
        ? options.path[variant || DEFAULT_VARIANT] || null
        : options.path;

      return (
        <AccessibleIcon label={title || options.title || options.displayName}>
          <Box className={clsx(classes.icon, className)} asChild {...props}>
            <svg
              role="presentation"
              viewBox={options.viewBox || '20 20 20 20'}
              data-variant={variant || DEFAULT_VARIANT}
              data-size={size}
              data-icon={options.displayName}
              data-accent-color={color || undefined}
            >
              {isString(path) ? <path d={path} fillRule="evenodd" /> : path}
            </svg>
          </Box>
        </AccessibleIcon>
      );
    },
    { displayName: options.displayName }
  );
