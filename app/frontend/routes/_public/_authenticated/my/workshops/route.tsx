import { NotFound } from '@/components/pages/NotFound';
import {
  PluralActivityType,
  activityTypeFromPlural,
  pluralFromActivityType,
} from '@/constants/activityTypes';
import { ActivityType } from '@/graphql/types';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/_authenticated/my/workshops')({
  parseParams: ({ activityType: plural }): { activityType: ActivityType } => ({
    activityType: activityTypeFromPlural(plural as PluralActivityType),
  }),
  stringifyParams: ({ activityType }) => ({
    activityType: pluralFromActivityType(activityType),
  }),
  notFoundComponent: NotFound,
});
