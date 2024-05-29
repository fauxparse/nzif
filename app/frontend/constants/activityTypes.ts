import { ActivityType } from '@/graphql/types';
import ConferenceIcon from '@/icons/ConferenceIcon';
import ShowIcon from '@/icons/ShowIcon';
import SocialEventIcon from '@/icons/SocialEventIcon';
import WorkshopIcon from '@/icons/WorkshopIcon';
import { mapKeys } from 'lodash-es';

export const ACTIVITY_TYPES = {
  [ActivityType.Workshop]: {
    type: ActivityType.Workshop,
    label: 'Workshop',
    plural: 'workshops',
    icon: WorkshopIcon,
    color: 'cyan',
  },
  [ActivityType.Show]: {
    type: ActivityType.Show,
    label: 'Show',
    plural: 'shows',
    icon: ShowIcon,
    color: 'magenta',
  },
  [ActivityType.SocialEvent]: {
    type: ActivityType.SocialEvent,
    label: 'Social event',
    plural: 'social-events',
    icon: SocialEventIcon,
    color: 'yellow',
  },
  [ActivityType.Conference]: {
    type: ActivityType.Conference,
    label: 'Conference',
    plural: 'conferences',
    icon: ConferenceIcon,
    color: 'yellow',
  },
} as const;

export type PluralActivityType = (typeof ACTIVITY_TYPES)[ActivityType]['plural'];

const BY_PLURAL = mapKeys(ACTIVITY_TYPES, ({ plural }) => plural) as Record<
  PluralActivityType,
  (typeof ACTIVITY_TYPES)[ActivityType]
>;

export const isPluralActivityType = (s: string): s is PluralActivityType => s in BY_PLURAL;

export const activityTypeFromPlural = (plural: PluralActivityType) => BY_PLURAL[plural]?.type;

export const activityTypeLabelFromPlural = (plural: PluralActivityType) => BY_PLURAL[plural].label;

export const pluralFromActivityType = (type: ActivityType) => ACTIVITY_TYPES[type]?.plural;

export const activityColor = (type: ActivityType) => ACTIVITY_TYPES[type].color;

export const activityIcon = (type: ActivityType) => ACTIVITY_TYPES[type].icon;

export const activityTypeLabel = (type: ActivityType) => ACTIVITY_TYPES[type].label;
