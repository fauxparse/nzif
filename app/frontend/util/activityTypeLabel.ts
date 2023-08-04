import { capitalize, startCase } from 'lodash-es';

import { ActivityType } from '@/graphql/types';
import { ROUTES } from '@/Routes';

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

export const pluralizeActivityType = (activityType: ActivityType): Pluralized =>
  PLURALIZED[activityType];

const activityTypeLabel = (activityType: ActivityType): string =>
  capitalize(startCase(activityType));

export default activityTypeLabel;

export const adminActivityLink = (activity: { type: ActivityType; slug: string }) =>
  ROUTES.ADMIN.ACTIVITY.buildPath({
    type: pluralizeActivityType(activity.type),
    slug: activity.slug,
  });
