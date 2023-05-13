import { useParams } from 'react-router-dom';
import { kebabCase } from 'lodash-es';
import pluralize from 'pluralize';

import { ActivityType, useActivityDetailsQuery } from '@/graphql/types';
import Breadcrumbs, { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import InPlaceEdit from '@/molecules/InPlaceEdit';
import activityTypeLabel from '@/util/activityTypeLabel';

type ActivityDetailsProps = {
  type: ActivityType;
};

const ActivityDetails: React.FC<ActivityDetailsProps> = ({ type }) => {
  const { year, slug } = useParams<{ year: string; slug: string }>() as {
    year: string;
    slug: string;
  };

  const { data, loading } = useActivityDetailsQuery({ variables: { year, type, slug } });

  const activity = data?.festival?.activity;

  const updateActivityName = (name: string) => Promise.resolve(name);

  return (
    <BreadcrumbProvider
      path={pluralize(kebabCase(type))}
      label={pluralize(activityTypeLabel(type))}
    >
      <div className="page">
        <header className="page__header">
          <Breadcrumbs />
          <h1>
            {loading || !activity ? (
              'Loading…'
            ) : (
              <InPlaceEdit value={activity.name} onChange={updateActivityName} />
            )}
          </h1>
        </header>
      </div>
    </BreadcrumbProvider>
  );
};

export default ActivityDetails;
