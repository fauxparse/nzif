import { ActivityType } from '@/graphql/types';
import ConferenceIcon from '@/icons/ConferenceIcon';
import ShowIcon from '@/icons/ShowIcon';
import SocialEventIcon from '@/icons/SocialEventIcon';
import WorkshopIcon from '@/icons/WorkshopIcon';

export const ACTIVITY_TYPES = {
  workshops: {
    type: ActivityType.Workshop,
    label: 'Workshops',
    icon: WorkshopIcon,
    color: 'cyan',
  },
  shows: {
    type: ActivityType.Show,
    label: 'Shows',
    icon: ShowIcon,
    color: 'magenta',
  },
  'social-events': {
    type: ActivityType.SocialEvent,
    label: 'Social events',
    icon: SocialEventIcon,
    color: 'yellow',
  },
  conferences: {
    type: ActivityType.Conference,
    label: 'Conference',
    icon: ConferenceIcon,
    color: 'yellow',
  },
} as const;

export type PluralActivityType = keyof typeof ACTIVITY_TYPES;

export const isPluralActivityType = (s: string): s is PluralActivityType => s in ACTIVITY_TYPES;

export const getActivityTypeFromPlural = (plural: PluralActivityType) =>
  ACTIVITY_TYPES[plural].type;

export const getActivityTypeLabelFromPlural = (plural: PluralActivityType) =>
  ACTIVITY_TYPES[plural].label;

export const getPluralFromActivityType = (type: ActivityType) =>
  Object.entries(ACTIVITY_TYPES).find(([, { type: t }]) => t === type)?.[0] as PluralActivityType;

export const getActivityColor = (type: ActivityType) => {
  const plural = getPluralFromActivityType(type);
  return ACTIVITY_TYPES[plural].color;
};

export const getActivityIcon = (type: ActivityType) => {
  const plural = getPluralFromActivityType(type);
  return ACTIVITY_TYPES[plural].icon;
};
