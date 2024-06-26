import clsx from 'clsx';
import React, { forwardRef } from 'react';

import { IconProps } from './Icon.types';
import ICONS from './icons';

import './Icon.css';

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ className, viewBox = '0 0 24 24', name, path, children, ...props }, ref) => (
    <svg ref={ref} className={clsx('icon', className)} viewBox={viewBox} {...props}>
      <title>{name}</title>
      {name && <path d={ICONS[name]} />}
      {path && <path d={path} />}
      {children}
    </svg>
  )
);

Icon.displayName = 'Icon';

export default Icon;
