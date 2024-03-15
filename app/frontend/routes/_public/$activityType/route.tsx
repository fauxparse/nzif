import RouteTransition from '@/components/helpers/RouteTransition';
import NotFound from '@/components/pages/NotFound';
import { getActivityTypeLabelFromPlural, isPluralActivityType } from '@/constants/activityTypes';
import { createFileRoute, notFound, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/$activityType')({
  beforeLoad: ({ params }) => {
    const { activityType } = params;

    if (!isPluralActivityType(activityType)) {
      return {
        getTitle: () => 'Not found',
      };
    }

    return {
      getTitle: () => getActivityTypeLabelFromPlural(activityType),
    };
  },
  loader: async ({ params }) => {
    const { activityType } = params;

    if (!isPluralActivityType(activityType)) {
      throw notFound();
    }
  },
  component: RouteTransition,
  notFoundComponent: NotFound,
});
