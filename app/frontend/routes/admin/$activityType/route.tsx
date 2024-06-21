import { RouteTransition } from '@/components/helpers/RouteTransition';
import { NotFound } from '@/components/pages/NotFound';
import {
  PluralActivityType,
  activityTypeFromPlural,
  activityTypeLabel,
  isPluralActivityType,
  pluralFromActivityType,
} from '@/constants/activityTypes';
import { createFileRoute, notFound } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/$activityType')({
  parseParams: ({ activityType: plural }) => {
    if (!isPluralActivityType(plural)) {
      throw notFound();
    }
    return { activityType: activityTypeFromPlural(plural as PluralActivityType) };
  },
  stringifyParams: ({ activityType }) => ({
    activityType: pluralFromActivityType(activityType),
  }),
  beforeLoad: ({ params }) => ({
    getTitle: () => activityTypeLabel(params.activityType),
  }),
  loader: async ({ params }) => {
    const { activityType } = params;

    if (!activityType) {
      throw notFound();
    }
  },
  component: RouteTransition,
  notFoundComponent: NotFound,
});
