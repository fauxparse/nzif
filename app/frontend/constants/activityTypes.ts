import { ActivityType } from '@/graphql/types';

export const ACTIVITY_TYPES = {
  workshops: {
    type: ActivityType.Workshop,
    label: 'Workshops',
  },
  shows: {
    type: ActivityType.Show,
    label: 'Shows',
  },
  'social-events': {
    type: ActivityType.SocialEvent,
    label: 'Social events',
  },
  conference: {
    type: ActivityType.Conference,
    label: 'Conference',
  },
} as const;

export type PluralActivityType = keyof typeof ACTIVITY_TYPES;

export const isPluralActivityType = (s: string): s is PluralActivityType => s in ACTIVITY_TYPES;

export const getActivityTypeFromPlural = (plural: PluralActivityType) =>
  ACTIVITY_TYPES[plural].type;

export const getActivityTypeLabelFromPlural = (plural: PluralActivityType) =>
  ACTIVITY_TYPES[plural].label;
