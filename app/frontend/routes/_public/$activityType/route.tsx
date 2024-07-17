import { RouteTransition } from '@/components/helpers/RouteTransition';
import { NotFound } from '@/components/pages/NotFound';
import {
  PluralActivityType,
  activityTypeFromPlural,
  activityTypeLabel,
  pluralFromActivityType,
} from '@/constants/activityTypes';
import { ActivityType } from '@/graphql/types';
import { createFileRoute } from '@tanstack/react-router';
import pluralize from 'pluralize';

export const Route = createFileRoute('/_public/$activityType')({
  parseParams: ({ activityType: plural }): { activityType: ActivityType } => ({
    activityType: activityTypeFromPlural(plural as PluralActivityType),
  }),
  stringifyParams: ({ activityType }) => ({
    activityType: pluralFromActivityType(activityType),
  }),
  component: RouteTransition,
  notFoundComponent: NotFound,
  beforeLoad: ({ params }) => ({
    getTitle: () => pluralize(activityTypeLabel(params.activityType)),
  }),
});
