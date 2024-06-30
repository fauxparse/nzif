import { Box, BoxProps } from '@mantine/core';
import { isString } from 'lodash-es';
import { ReactNode, isValidElement } from 'react';

import clsx from 'clsx';
import './Icon.css';

const DEFAULT_VARIANT = 'outline' as const;
const DEFAULT_SIZE = 'md' as const;

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

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type IconProps<T extends CreateIconOptions = CreateIconOptions> = Omit<BoxProps, 'title'> & {
  variant?: T extends { path: PathDefinitions } ? keyof T['path'] : typeof DEFAULT_VARIANT;
  title?: string;
  size?: IconSize;
};

const hasMultipleVariants = (path: PathDefinition | PathDefinitions): path is PathDefinitions =>
  typeof path !== 'string' && !isValidElement(path);

export const createIcon = <const T extends CreateIconOptions>(options: T) =>
  Object.assign(
    ({ variant, size = DEFAULT_SIZE, title, className, ...props }: IconProps<T>) => {
      const path = hasMultipleVariants(options.path)
        ? options.path[variant || DEFAULT_VARIANT] || null
        : options.path;

      return (
        <Box
          className={clsx('icon', className)}
          data-variant={variant || DEFAULT_VARIANT}
          data-size={size}
          data-icon={options.displayName}
          component="svg"
          role="img"
          aria-description={title || options.title || options.displayName}
          viewBox={options.viewBox || '20 20 20 20'}
          {...props}
        >
          {isString(path) ? <path d={path} fillRule="evenodd" /> : path}
        </Box>
      );
    },
    { displayName: options.displayName }
  );
