import { ResultOf, readFragment } from '@/graphql';
import { Session } from '@/graphql/types';
import sentence from '@/util/sentence';
import { AspectRatio, Card, Flex, Inset, Skeleton, Text } from '@radix-ui/themes';
import { map, uniqBy } from 'lodash-es';
import { useMemo } from 'react';
import {
  ActivityCardFragment,
  ActivityCardPictureFragment,
  ActivityCardPresenterFragment,
} from './queries';

import Placename from '@/components/atoms/Placename';
import BlurrableImage from '@/components/molecules/BlurrableImage';
import { Link } from '@tanstack/react-router';
import classes from './ActivityCard.module.css';

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

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const loading = false;
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
    <Card size="2" variant="classic" data-loading={loading}>
      <Inset side="top" mb="2">
        <Skeleton loading={loading}>
          <AspectRatio ratio={16 / 9}>
            <Link
              to="/$activityType/$slug"
              params={{ activityType: activity.type, slug: activity.slug }}
            >
              {picture && (
                <BlurrableImage
                  src={picture.medium}
                  blurhash={picture.blurhash}
                  alt={activity.name}
                />
              )}
            </Link>
          </AspectRatio>
        </Skeleton>
      </Inset>
      <Flex direction="column" gap="1">
        <Skeleton loading={loading}>
          <Text className={classes.title} size="4" weight="medium">
            {activity.name}
          </Text>
        </Skeleton>
        <Skeleton loading={loading}>
          <Text className={classes.presenters} size="3">
            {presenterNames}
          </Text>
          <Flex gap="1" wrap="wrap">
            {locations.map((city) => (
              <Placename key={city.id} city={city} />
            ))}
          </Flex>
        </Skeleton>
      </Flex>
      {/* <Skeleton
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
      </div> */}
    </Card>
  );
};

export default ActivityCard;
