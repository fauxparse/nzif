import RouteTransition from '@/components/helpers/RouteTransition';
import NotFound from '@/components/pages/NotFound';
import {
  PluralActivityType,
  activityTypeFromPlural,
  activityTypeLabel,
  pluralFromActivityType,
} from '@/constants/activityTypes';
import { ActivityType } from '@/graphql/types';
import { createFileRoute, notFound } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/$activityType')({
  beforeLoad: ({ params }) => {
    const { activityType } = params;

    const plural = pluralFromActivityType(activityType as ActivityType);

    if (!plural) {
      return {
        getTitle: () => 'Not found',
      };
    }

    return {
      getTitle: () => activityTypeLabel(activityType as ActivityType),
    };
  },
  parseParams: ({ activityType: plural }): { activityType: ActivityType } => {
    const activityType = activityTypeFromPlural(plural as PluralActivityType);
    if (!activityType) {
      throw notFound();
    }
    return { activityType };
  },
  stringifyParams: ({ activityType }) => ({
    activityType: pluralFromActivityType(activityType),
  }),
  component: RouteTransition,
  notFoundComponent: NotFound,
});
