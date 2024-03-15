import { motion } from 'framer-motion';
import { ResultOf, graphql, readFragment } from '@/graphql';
import BlurrableImage from '@/components/molecules/BlurrableImage';
import Skeleton from '@/components/helpers/Skeleton';
import { Session } from '@/graphql/types';
import { Box } from '@mantine/core';
import { Link, ToOptions } from '@tanstack/react-router';
import Card from '@/components/molecules/Card';

const ActivityCardPresenterFragment = graphql(`
  fragment ActivityCardPresenter on Person {
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
`);

const ActivityCardPictureFragment = graphql(`
  fragment ActivityCardPicture on ActivityPicture {
    id
    medium
    blurhash
  }
`);

export const ActivityCardFragment = graphql(
  `#graphql
  fragment ActivityCard on Activity {
    id
    name
    type
    slug

    picture {
      ...ActivityCardPicture
    }

    presenters {
      ...ActivityCardPresenter
    }

    sessions {
      id
      startsAt
      endsAt
    }
  }
`,
  [ActivityCardPresenterFragment, ActivityCardPictureFragment]
);

export type ActivityCardSession = Pick<
  Session,
  keyof ResultOf<typeof ActivityCardFragment>['sessions'][number]
>;

export type ActivityCardActivity = Omit<ResultOf<typeof ActivityCardFragment>, 'sessions'> & {
  sessions: ActivityCardSession[];
};

type ActivityCardProps = {
  activity: ActivityCardActivity;
  loading?: boolean;
};

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, loading = false }) => {
  const picture = readFragment(ActivityCardPictureFragment, activity.picture);
  const presenters = readFragment(ActivityCardPresenterFragment, activity.presenters);

  return (
    <Card
      component={Link}
      to="/$activityType/$slug"
      params={((current) => ({ ...current, slug: activity.slug })) as ToOptions['params']}
      className="card activity-card"
    >
      <Skeleton visible={loading} className="card__picture">
        {picture && (
          <BlurrableImage src={picture.medium} blurhash={picture.blurhash} alt={activity.name} />
        )}
      </Skeleton>
      <div className="card__title">
        {loading ? (
          <>
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="1rem" width="60%" mt="0.5rem" />
          </>
        ) : (
          activity.name
        )}
      </div>
    </Card>
  );
};

export default ActivityCard;
