import { Link, useLocation, useResolvedPath } from 'react-router-dom';
import { kebabCase } from 'lodash-es';
import pluralize from 'pluralize';

import { ActivityType } from '@/graphql/types';
import Tabs from '@/molecules/Tabs';
import activityTypeLabel from '@/util/activityTypeLabel';

type ActivityTabProps = {
  type: ActivityType;
};

const ActivityTab: React.FC<ActivityTabProps> = ({ type }) => {
  const slug = kebabCase(pluralize(type));
  const path = useResolvedPath(`../${slug}`);
  const location = useLocation();

  return (
    <Tabs.Tab
      as={Link}
      to={path}
      key={type}
      text={pluralize(activityTypeLabel(type))}
      selected={location.pathname === path.pathname}
    />
  );
};

export default ActivityTab;
