import clsx from 'clsx';
import React, { ElementType, forwardRef, Fragment, useContext } from 'react';

import Icon from '@/atoms/Icon';

import { BreadcrumbsComponent } from './Breadcrumbs.types';
import Context from './Context';
import Link from './Link';

import './Breadcrumbs.css';

const BreadcrumbsContainer: BreadcrumbsComponent = forwardRef(
  ({ as, className, children, ...props }, ref) => {
    const Component = (as || 'div') as ElementType;

    const { crumbs } = useContext(Context);

    return (
      <Component ref={ref} className={clsx('breadcrumbs', className)} {...props}>
        {crumbs.slice(0).map(({ label, path }, index) => (
          <Fragment key={index}>
            {!!index && <Icon name="chevronRight" />}
            <Link to={path}>{label}</Link>
          </Fragment>
        ))}
      </Component>
    );
  }
);

BreadcrumbsContainer.displayName = 'Breadcrumbs';

const Breadcrumbs = Object.assign(BreadcrumbsContainer, {
  Link,
});

export default Breadcrumbs;
