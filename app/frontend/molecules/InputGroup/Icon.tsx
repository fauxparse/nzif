import clsx from 'clsx';
import React, { forwardRef } from 'react';

import OriginalIcon, { IconProps } from '@/atoms/Icon';

import { InputGroupIconPosition } from './InputGroup.types';

export const Icon = forwardRef<SVGSVGElement, IconProps & { position?: InputGroupIconPosition }>(
  ({ className, position = 'start', children, ...props }, ref) => (
    <OriginalIcon
      ref={ref}
      className={clsx('input-group__icon', className)}
      data-position={position}
      {...props}
    >
      {children}
    </OriginalIcon>
  )
);

Icon.displayName = 'InputGroup.Icon';

export default Icon;
