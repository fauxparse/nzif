import { Badge, Card, Flex, Inset, Skeleton, Text } from '@radix-ui/themes';
import { Responsive } from '@radix-ui/themes/dist/esm/props/prop-def.js';
import { Link, LinkProps, useRouter } from '@tanstack/react-router';
import clsx from 'clsx';
import { map, uniqBy } from 'lodash-es';
import { PropsWithChildren, useMemo } from 'react';
import Placename from '@/components/atoms/Placename';
import { RoutableLink } from '@/components/helpers/RoutableLink';
import BlurrableImage from '@/components/molecules/BlurrableImage';
import { ResultOf, readFragment } from '@/graphql';
import { Session } from '@/graphql/types';
import sentence from '@/util/sentence';
import classes from './ActivityCard.module.css';
import {
  ActivityCardFragment,
  ActivityCardPictureFragment,
  ActivityCardPresenterFragment,
} from './queries';

export type ActivityCardSession = Pick<
  Session,
  keyof ResultOf<typeof ActivityCardFragment>['sessions'][number] | 'full'
>;

export type ActivityCardActivity = Omit<ResultOf<typeof ActivityCardFragment>, 'sessions'> & {
  sessions: ActivityCardSession[];
};

const hasAssociated = (activity: ActivityCardActivity) =>
  ('show' in activity && !!activity.show) || ('workshop' in activity && !!activity.workshop);

export type ActivityCardProps = PropsWithChildren<{
  className?: string;
  activity: ActivityCardActivity;
  loading?: boolean;
  size?: Responsive<'1' | '2'>;
  linkProps?: LinkProps;
  disabled?: boolean;
  buttons?: React.ReactNode;
  full?: boolean;
}>;

export const ActivityCard: React.FC<ActivityCardProps> = ({
  className,
  activity,
  loading = false,
  size = { initial: '1', sm: '2' },
  children,
  linkProps,
  disabled = false,
  full,
  buttons,
}) => {
  const router = useRouter();

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

  const presenterNames = sentence(presenters.map((presenter) => presenter.name));

  return (
    <Card
      className={clsx(classes.card, className)}
      size={size}
      variant="classic"
      data-loading={loading}
      data-disabled={disabled || undefined}
    >
      <Inset className={classes.topSection} side={{ initial: 'all', sm: 'top' }}>
        <Skeleton loading={loading}>
          <ActivityLink activity={activity} linkProps={linkProps}>
            {picture && (
              <BlurrableImage
                src={picture.medium}
                blurhash={picture.blurhash}
                alt={picture.altText || activity.name}
              />
            )}
          </ActivityLink>
        </Skeleton>
      </Inset>
      <div className={classes.body}>
        <Skeleton loading={loading}>
          <Text className={classes.title} weight="medium">
            <ActivityLink activity={activity} linkProps={linkProps}>
              {activity.name}
            </ActivityLink>
          </Text>
        </Skeleton>
        <Skeleton loading={loading}>
          <Text className={classes.presenters} size={{ initial: '2', sm: '3' }} mb="2">
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
      </div>
      <Flex className={classes.badges} wrap="wrap" gap="1">
        {isEnsemble && (
          <Badge variant="surface" size={size}>
            NZIF
          </Badge>
        )}
        {hasAssociated(activity) && (
          <Badge variant="surface" size={size}>
            Workshop to show
          </Badge>
        )}
      </Flex>
      {children}
      {buttons && (
        <Flex className={classes.buttons} gap="1">
          {buttons}
        </Flex>
      )}
      {full && (
        <Inset side={{ initial: 'all', sm: 'x' }} asChild>
          <span className={classes.soldOut}>Sold out</span>
        </Inset>
      )}
    </Card>
  );
};

const ActivityLink: React.FC<
  PropsWithChildren<Pick<ActivityCardProps, 'activity' | 'linkProps'>>
> = ({ activity, linkProps, children }) =>
  useRouter() && linkProps ? (
    <Link {...linkProps}>{children}</Link>
  ) : (
    <RoutableLink
      {...{
        to: '/$activityType/$slug',
        params: { activityType: activity.type, slug: activity.slug },
      }}
    >
      {children}
    </RoutableLink>
  );
