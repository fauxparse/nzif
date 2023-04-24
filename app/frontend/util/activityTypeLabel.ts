import { capitalize, startCase } from 'lodash-es';

import { ActivityType } from '@/graphql/types';

const activityTypeLabel = (activityType: ActivityType): string =>
  capitalize(startCase(activityType));

export default activityTypeLabel;
