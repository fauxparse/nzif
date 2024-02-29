import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { graphql } from '@/graphql';
import { Container, Tabs } from '@mantine/core';
import Header from '@/components/Header';

import './$activityType.css';
import { ACTIVITY_TYPES } from '@/constants/activityTypes';
import Button from '@/components/Button';
import ActivityTypeTabs from '@/components/molecules/ActivityTypeTabs';

const AssociatedActivityFragment = graphql(`
  fragment AssociatedActivity on Activity @_unmask {
    id
    name
    type

    sessions {
      id
      startsAt
      endsAt
    }
  }
`);

const ActivitiesQuery = graphql(
  `#graphql
  query Programme($type: ActivityType!) {
    festival {
      id
      activities(type: $type) {
        id
        name
        type
        slug

        picture {
          id
          medium
          blurhash
        }

        presenters {
          id
          name
          city {
            id
            name
            traditionalName
          }
          country {
            id
            name
            traditionalName
          }
        }

        ... on Workshop {
          show {
            ...AssociatedActivity
          }
        }

        ... on Show {
          workshop {
            ...AssociatedActivity
          }
        }

        sessions {
          id
          startsAt
          endsAt
        }
      }
    }
  }
`,
  [AssociatedActivityFragment]
);

const Component = () => {
  const params = Route.useParams();
  const plural = params.activityType as keyof typeof ACTIVITY_TYPES;
  const activities = Route.useLoaderData();

  const navigate = useNavigate();

  return (
    <>
      <Header
        title="Festival programme"
        tabs={
          <ActivityTypeTabs
            value={plural}
            onChange={(value) => {
              if (!value) return;
              navigate({ to: '/$activityType', params: { activityType: value } });
            }}
          />
        }
      />
      <Container>
        <ul>
          {activities.map((activity) => (
            <li key={activity.id}>
              <Link
                to="/$activityType/$slug"
                params={{ activityType: plural, slug: activity.slug }}
              >
                {activity.name}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
};

export const Route = createFileRoute('/_public/$activityType/')({
  component: Component,
  loader: async ({ params, context: { client } }) => {
    const plural = params.activityType as keyof typeof ACTIVITY_TYPES;
    const { type } = ACTIVITY_TYPES[plural];

    const { data } = await client.query({
      query: ActivitiesQuery,
      variables: { type },
    });

    return data.festival.activities;
  },
});
