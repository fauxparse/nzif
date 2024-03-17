import Placename from '@/components/atoms/Placename';
import Tag from '@/components/atoms/Tag';
import Skeleton from '@/components/helpers/Skeleton';
import BlurrableImage from '@/components/molecules/BlurrableImage';
import Card from '@/components/molecules/Card';
import { ResultOf, graphql, readFragment } from '@/graphql';
import { Session } from '@/graphql/types';
import ShowIcon from '@/icons/ShowIcon';
import WorkshopIcon from '@/icons/WorkshopIcon';
import sentence from '@/util/sentence';
import { Link, ToOptions } from '@tanstack/react-router';
import { map, uniqBy } from 'lodash-es';
import { useMemo } from 'react';

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

    ...on Workshop {
      show {
        id
      }
    }

    ...on Show {
      workshop {
        id
      }
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

const hasAssociated = (activity: ActivityCardActivity) =>
  ('show' in activity && !!activity.show) || ('workshop' in activity && !!activity.workshop);

type ActivityCardProps = {
  activity: ActivityCardActivity;
  loading?: boolean;
};

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, loading = false }) => {
  const picture = readFragment(ActivityCardPictureFragment, activity.picture);
  const presenters = readFragment(ActivityCardPresenterFragment, activity.presenters);

  const isEnsemble =
    activity.type === 'Show' && presenters[0].name === 'New Zealand Improv Festival';

  const locations = useMemo(
    () =>
      uniqBy(map(presenters, 'city'), 'id').filter(Boolean) as {
        id: string;
        name: string;
        traditionalName: string;
      }[],
    [presenters]
  );

  const presenterNames = isEnsemble
    ? 'NZIF Ensemble'
    : sentence(presenters.map((presenter) => presenter.name));

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
      <div className="card__content">
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
        <div className="card__description">
          {loading ? <Skeleton height="1rem" width="80%" /> : presenterNames}
        </div>
        <div className="card__tags">
          {!isEnsemble &&
            locations.map((location) => (
              <Placename
                key={location.id}
                name={location.name}
                traditionalName={location.traditionalName || location.name}
              />
            ))}
          {hasAssociated(activity) && (
            <Tag
              color="cyan"
              leftSection={activity.type === 'Workshop' ? <ShowIcon /> : <WorkshopIcon />}
            >
              Workshop to show
            </Tag>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ActivityCard;
