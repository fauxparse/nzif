import { ActivityEditor } from '@/components/pages/admin/ActivityEditor';
import { ActivityDetailsQuery } from '@/components/pages/admin/ActivityEditor/queries';
import { ResultOf } from '@/graphql';
import { Text } from '@mantine/core';
import { createFileRoute, notFound, useChildMatches } from '@tanstack/react-router';
import { DateTime } from 'luxon';

const Component = () => {
  const { activity } = Route.useLoaderData();

  const matches = useChildMatches();

  if (!activity) throw notFound();

  const sessionStartsAt =
    (matches.find((match) => 'session' in match.params)?.params as { session: DateTime })
      ?.session ?? null;

  const session =
    (sessionStartsAt &&
      activity.sessions.find((s) => s.startsAt.hasSame(sessionStartsAt, 'day'))) ??
    null;

  return <ActivityEditor activity={activity} session={session} />;
};

export const Route = createFileRoute('/admin/$activityType/$slug')({
  beforeLoad: () => {
    return {
      getTitle: (activity: ResultOf<typeof ActivityDetailsQuery>['festival']['activity']) =>
        activity?.name,
    };
  },
  loader: async ({ params, context }) => {
    const { activityType, slug } = params;
    const { client, year } = context;

    const activity = await client
      .query({
        query: ActivityDetailsQuery,
        variables: {
          year,
          type: activityType,
          slug,
        },
      })
      .then(({ data }) => data.festival.activity);

    if (!activity) throw notFound();

    return { activity };
  },
  component: Component,
  pendingComponent: () => <Text>Loading…</Text>,
});
