import React, { ElementType, forwardRef } from 'react';
import clsx from 'clsx';

import { PageHeaderComponent } from './PageHeader.types';

import './PageHeader.css';

export const PageHeader: PageHeaderComponent = forwardRef(({ as, className, ...props }, ref) => {
  const Component = (as || 'div') as ElementType;

  return <Component ref={ref} className={clsx('page-header', className)} {...props} />;
});

PageHeader.displayName = 'PageHeader';

export default PageHeader;
