import { ActionList } from '@/components/molecules/ActionList';
import { FragmentOf } from '@/graphql';
import ActivityIcon from '@/icons/ActivityIcon';
import { Link } from '@tanstack/react-router';
import { sortBy } from 'lodash-es';
import { useMemo } from 'react';
import { MyActivityFragment } from './queries';

import { ActivityType } from '@/graphql/types';
import { Separator, Text } from '@radix-ui/themes';
import classes from './NavigationMenu.module.css';

type Activity = FragmentOf<typeof MyActivityFragment>;

type MyActivitiesProps = {
  activities: Activity[];
};

export const MyActivities: React.FC<MyActivitiesProps> = ({ activities }) => {
  const sessions = useMemo(
    () =>
      sortBy(
        activities.flatMap((activity) =>
          activity.sessions.map((session) => ({ activity, session }))
        ),
        'session.startsAt'
      ),
    [activities]
  );

  if (!sessions.length) {
    return null;
  }

  return (
    <>
      <Separator size="4" my="4" />
      <ActionList className={classes.items}>
        {sessions.map(
          ({ activity, session }) =>
            activity.type === ActivityType.Workshop && (
              <ActionList.Item asChild key={session.id} className={classes.myActivity}>
                <Link
                  to="/my/$activityType/$slug/$sessionId"
                  params={{
                    activityType: activity.type,
                    slug: activity.slug,
                    sessionId: session.id,
                  }}
                >
                  <ActivityIcon activityType={activity.type} />
                  <div>
                    <Text as="div">{activity.name}</Text>
                    <Text as="div" size="2" color="gray" weight="regular">
                      {session.startsAt.plus({}).toFormat('EEEE d/M')}
                    </Text>
                  </div>
                </Link>
              </ActionList.Item>
            )
        )}
      </ActionList>
    </>
  );
};
