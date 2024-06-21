import Placename from '@/components/atoms/Placename';
import Tag from '@/components/atoms/Tag';
import BlurrableImage from '@/components/molecules/BlurrableImage';
import Card from '@/components/molecules/Card';
import { ResultOf, readFragment } from '@/graphql';
import { Session } from '@/graphql/types';
import ShowIcon from '@/icons/ShowIcon';
import WorkshopIcon from '@/icons/WorkshopIcon';
import sentence from '@/util/sentence';
import { Skeleton } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { map, uniqBy } from 'lodash-es';
import { useMemo } from 'react';
import {
  ActivityCardFragment,
  ActivityCardPictureFragment,
  ActivityCardPresenterFragment,
} from './queries';

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
    activity.type === 'Show' && presenters[0]?.name === 'New Zealand Improv Festival';

  const locations = useMemo(
    () =>
      uniqBy(map(presenters, 'city'), 'id').filter(Boolean) as {
        id: string;
        name: string;
        traditionalNames: string[];
        country: string;
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
      params={{ slug: activity.slug }}
      className="card activity-card"
      data-loading={loading}
    >
      <Skeleton
        visible={loading}
        animate={loading}
        className="card__picture"
        width="100%"
        height="11.25rem"
      >
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
                traditionalName={location.traditionalNames[0] || location.name}
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
