import { RouteTransition } from '@/components/helpers/RouteTransition';
import { NotFound } from '@/components/pages/NotFound';
import {
  PluralActivityType,
  activityTypeFromPlural,
  pluralFromActivityType,
} from '@/constants/activityTypes';
import { ActivityType } from '@/graphql/types';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/$activityType')({
  parseParams: ({ activityType: plural }): { activityType: ActivityType } => ({
    activityType: activityTypeFromPlural(plural as PluralActivityType),
  }),
  stringifyParams: ({ activityType }) => ({
    activityType: pluralFromActivityType(activityType),
  }),
  component: RouteTransition,
  notFoundComponent: NotFound,
});
