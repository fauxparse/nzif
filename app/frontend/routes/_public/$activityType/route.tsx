import { createFileRoute, redirect } from '@tanstack/react-router';
import { getActivityTypeLabelFromPlural, isPluralActivityType } from '@/constants/activityTypes';

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
});
