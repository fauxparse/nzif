import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { upperFirst } from 'lodash-es';

import Breadcrumbs, { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import PageHeader from '@/molecules/PageHeader';
import { ROUTES } from '@/Routes';

export const Component: React.FC = () => {
  const { type: pluralizedType, slug } = useTypedParams(ROUTES.ACTIVITY);

  return (
    <BreadcrumbProvider label={upperFirst(pluralizedType.replace(/-/g, ' '))} path={pluralizedType}>
      <PageHeader>
        <Breadcrumbs />
        <h1>details</h1>
      </PageHeader>
    </BreadcrumbProvider>
  );
};

Component.displayName = 'ActivityDetails';

export default Component;
