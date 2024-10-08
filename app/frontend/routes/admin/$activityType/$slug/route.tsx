import { ActivityEditor } from '@/components/pages/admin/ActivityEditor';
import { ActivityDetailsQuery } from '@/components/pages/admin/ActivityEditor/queries';
import { Tab } from '@/components/pages/admin/ActivityEditor/types';
import { ResultOf } from '@/graphql';
import { ActivityType } from '@/graphql/types';
import { useFestival } from '@/hooks/useFestival';
import { useQuery } from '@apollo/client';
import { Text } from '@radix-ui/themes';
import { createFileRoute, notFound, useChildMatches } from '@tanstack/react-router';
import { DateTime } from 'luxon';

type Activity = ResultOf<typeof ActivityDetailsQuery>['festival']['activity'];

const useTab = (activity: Activity | null, loading: boolean): Tab => {
  const matches = useChildMatches();

  if (loading || !activity) return 'details';

  if (matches.find((match) => match.routeId.endsWith('/feedback'))) return 'feedback';

  const sessionStartsAt =
    (matches.find((match) => 'session' in match.params)?.params as { session: DateTime })
      ?.session ?? null;

  const session =
    (sessionStartsAt &&
      activity.sessions.find((s) => s.startsAt.hasSame(sessionStartsAt, 'day'))) ||
    null;

  if (session) return { session };

  if (matches.find((match) => match.routeId.endsWith('/show'))) {
    if (activity.type === ActivityType.Workshop && 'show' in activity) {
      const show = activity.show?.sessions[0];
      if (show) return { show };
    }
  }

  return 'details';
};

export const Route = createFileRoute('/admin/$activityType/$slug')({
  beforeLoad: () => {
    return {
      getTitle: (activity: Activity | null) => activity?.name,
    };
  },
  component: () => {
    const festival = useFestival();
    const { activityType, slug } = Route.useParams();

    const { loading, data } = useQuery(ActivityDetailsQuery, {
      variables: { year: festival.id, type: activityType, slug },
    });

    const activity = data?.festival?.activity ?? null;

    const matches = useChildMatches();

    const tab = useTab(activity, loading);

    if (!loading && !activity) throw notFound();

    if (!activity) return null;

    return <ActivityEditor activity={activity} tab={tab} />;
  },
  pendingComponent: () => <Text>Loading…</Text>,
});
