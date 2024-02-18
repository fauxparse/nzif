import clsx from 'clsx';
import React, { ComponentPropsWithoutRef } from 'react';
import { Link } from 'react-router-dom';

const BreadcrumbsLink: React.FC<ComponentPropsWithoutRef<typeof Link>> = ({
  className,
  ...props
}) => <Link className={clsx('breadcrumbs__link', className)} {...props} />;

export default BreadcrumbsLink;
