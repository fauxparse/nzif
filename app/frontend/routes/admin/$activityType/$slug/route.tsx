import { ActivityEditor } from '@/components/pages/admin/ActivityEditor';
import { ActivityDetailsQuery } from '@/components/pages/admin/ActivityEditor/queries';
import { ResultOf } from '@/graphql';
import { useFestival } from '@/hooks/useFestival';
import { useQuery } from '@apollo/client';
import { Text } from '@radix-ui/themes';
import { createFileRoute, notFound, useChildMatches } from '@tanstack/react-router';
import { DateTime } from 'luxon';

export const Route = createFileRoute('/admin/$activityType/$slug')({
  beforeLoad: () => {
    return {
      getTitle: (activity: ResultOf<typeof ActivityDetailsQuery>['festival']['activity']) =>
        activity?.name,
    };
  },
  component: () => {
    const festival = useFestival();
    const { activityType, slug } = Route.useParams();

    const { loading, data } = useQuery(ActivityDetailsQuery, {
      variables: { year: festival.id, type: activityType, slug },
    });

    const activity = data?.festival?.activity;

    const matches = useChildMatches();

    if (!loading && !activity) throw notFound();

    if (!activity) return null;

    const sessionStartsAt =
      (matches.find((match) => 'session' in match.params)?.params as { session: DateTime })
        ?.session ?? null;

    const show = !!matches.find((match) => match.routeId.endsWith('/show'));

    const session =
      (sessionStartsAt &&
        activity.sessions.find((s) => s.startsAt.hasSame(sessionStartsAt, 'day'))) ??
      null;

    return <ActivityEditor activity={activity} session={session} show={show} />;
  },
  pendingComponent: () => <Text>Loading…</Text>,
});
