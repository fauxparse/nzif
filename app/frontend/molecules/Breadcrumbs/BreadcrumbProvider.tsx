import React, { PropsWithChildren, useContext, useMemo } from 'react';
import { last } from 'lodash-es';

import { Crumb } from './Breadcrumbs.types';
import Context from './Context';

const BreadcrumbProvider: React.FC<PropsWithChildren<Crumb>> = ({ label, path, children }) => {
  const { crumbs: existing } = useContext(Context);

  const crumbs = useMemo(
    () => [...existing, { label, path: (last(existing)?.path || '') + '/' + path }],
    [existing, label, path]
  );

  return <Context.Provider value={{ crumbs }}>{children}</Context.Provider>;
};

export default BreadcrumbProvider;
