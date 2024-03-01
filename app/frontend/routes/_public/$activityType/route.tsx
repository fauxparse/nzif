import { createFileRoute, redirect } from '@tanstack/react-router';
import { getActivityTypeLabelFromPlural, isPluralActivityType } from '@/constants/activityTypes';
import RouteTransition from '@/components/RouteTransition';

export const Route = createFileRoute('/_public/$activityType')({
  beforeLoad: ({ params }) => {
    const { activityType } = params;

    if (!isPluralActivityType(activityType)) {
      throw redirect({ to: '/' });
    }

    return {
      getTitle: () => getActivityTypeLabelFromPlural(activityType),
    };
  },
  component: RouteTransition,
});
