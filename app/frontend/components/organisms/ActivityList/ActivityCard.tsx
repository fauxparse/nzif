import Placename from '@/components/atoms/Placename';
import BlurrableImage from '@/components/molecules/BlurrableImage';
import { ResultOf, readFragment } from '@/graphql';
import { Session } from '@/graphql/types';
import sentence from '@/util/sentence';
import { AspectRatio, Badge, Card, Flex, Inset, Skeleton, Text } from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';
import { map, uniqBy } from 'lodash-es';
import { useMemo } from 'react';
import {
  ActivityCardFragment,
  ActivityCardPictureFragment,
  ActivityCardPresenterFragment,
} from './queries';

import classes from './ActivityList.module.css';

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

const ActivityCard: React.FC<ActivityCardProps> = ({ loading, activity }) => {
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
    <Card className={classes.card} size="2" variant="classic" data-loading={loading}>
      <Inset className={classes.topSection} side="top" mb="2">
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
            <Flex className={classes.badges} wrap="wrap" gap="1">
              {isEnsemble && <Badge variant="surface">NZIF Ensemble</Badge>}
              {hasAssociated(activity) && <Badge variant="surface">Workshop to show</Badge>}
            </Flex>
          </AspectRatio>
        </Skeleton>
      </Inset>
      <Skeleton loading={loading}>
        <Text className={classes.title} size="4" weight="medium">
          {activity.name}
        </Text>
      </Skeleton>
      <Skeleton loading={loading}>
        <Text className={classes.presenters} size="3">
          {presenterNames}
        </Text>
      </Skeleton>
      <Flex gap="1" wrap="wrap">
        {loading ? (
          <Skeleton loading>
            <Badge radius="full" aria-busy>
              Loading…
            </Badge>
          </Skeleton>
        ) : (
          locations.map((city) => <Placename key={city.id} city={city} />)
        )}
      </Flex>
    </Card>
  );
};

export default ActivityCard;
