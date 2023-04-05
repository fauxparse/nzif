import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { IconProps } from './Icon.types';

import './Icon.css';

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ className, viewBox = '0 0 24 24', children, path, ...props }, ref) => (
    <svg ref={ref} className={clsx('icon', className)} viewBox={viewBox} {...props}>
      {path && <path d={path} />}
      {children}
    </svg>
  )
);

Icon.displayName = 'Icon';

export default Icon;
