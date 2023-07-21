import { capitalize, startCase } from 'lodash-es';

import { ActivityType } from '@/graphql/types';

const PLURALIZED = {
  [ActivityType.Workshop]: 'workshops',
  [ActivityType.Show]: 'shows',
  [ActivityType.SocialEvent]: 'social-events',
} as const;

export type Pluralized = (typeof PLURALIZED)[keyof typeof PLURALIZED];

const SINGULARIZED = {
  workshops: ActivityType.Workshop,
  shows: ActivityType.Show,
  'social-events': ActivityType.SocialEvent,
} as const;

export const activityTypeFromPluralized = (plural: Pluralized): ActivityType =>
  SINGULARIZED[plural];

const activityTypeLabel = (activityType: ActivityType): string =>
  capitalize(startCase(activityType));

export default activityTypeLabel;
