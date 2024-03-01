import { Link, createFileRoute } from '@tanstack/react-router';
import { ResultOf, graphql } from '@/graphql';
import { useBreadcrumbs } from '@/hooks/useRoutesWithTitles';
import { Fragment } from 'react';
import ChevronRightIcon from '@/icons/ChevronRightIcon';
import Header from '@/components/Header';
import {
  ACTIVITY_TYPES,
  PluralActivityType,
  getActivityTypeFromPlural,
} from '@/constants/activityTypes';
import Body from '@/components/Body';
import Switch from '@/components/Switch';

const ActivityDetailsQuery = graphql(`
  query ActivityDetails($year: String!, $type: ActivityType!, $slug: String!) {
    festival(year: $year) {
      id

      activity(type: $type, slug: $slug) {
        id
        name
        description

        presenters {
          id
          name
        }

        picture {
          id
          large
          blurhash
        }
      }
    }
  }
`);

const Component = () => {
  const context = Route.useRouteContext();
  const breadcrumbs = useBreadcrumbs();

  const activity = Route.useLoaderData();

  if (!activity) return null;

  return (
    <>
      <Header
        background={
          activity.picture?.large
            ? {
                src: activity.picture.large,
                blurhash: activity.picture.blurhash,
              }
            : undefined
        }
        data-color="magenta"
      />
      <Body>
        <div className="container" />
      </Body>
    </>
  );
};

export const Route = createFileRoute('/_public/$activityType/$slug')({
  beforeLoad: () => {
    return {
      getTitle: (activity: ResultOf<typeof ActivityDetailsQuery>['festival']['activity']) =>
        activity?.name,
    };
  },
  loader: async ({ params, context }) => {
    const { activityType, slug } = params;
    const { client, year } = context;

    const type = getActivityTypeFromPlural(activityType as PluralActivityType);

    const { data } = await client.query({
      query: ActivityDetailsQuery,
      variables: {
        year,
        type,
        slug,
      },
    });

    return data.festival.activity;
  },
  component: Component,
});
