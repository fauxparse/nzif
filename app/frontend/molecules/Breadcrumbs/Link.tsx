import React, { ComponentPropsWithoutRef } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const BreadcrumbsLink: React.FC<ComponentPropsWithoutRef<typeof Link>> = ({
  className,
  ...props
}) => <Link className={clsx('breadcrumbs__link', className)} {...props} />;

export default BreadcrumbsLink;
