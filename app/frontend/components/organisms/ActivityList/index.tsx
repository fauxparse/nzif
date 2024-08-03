import { ActivityCard, ActivityCardActivity } from '@/components/molecules/ActivityCard';
import { ActivityType } from '@/graphql/types';
import { Box, Flex, Grid, Skeleton, Text } from '@radix-ui/themes';
import { useActivityGroups } from './useActivityGroups';

import classes from './ActivityList.module.css';

type ActivityListProps = {
  type: ActivityType;
  activities: ActivityCardActivity[];
  loading?: boolean;
};

export const ActivityList: React.FC<ActivityListProps> = ({
  type,
  activities,
  loading = false,
}) => {
  const days = useActivityGroups(activities);

  return (
    <>
      {days.map(([date, activities], i) => {
        const endTime = activities[0].session.endsAt;

        return (
          <section key={i} className={classes.day}>
            <Box className={classes.dayHeader}>
              <Flex
                pt={{ initial: '3', sm: '6' }}
                pb="3"
                gridColumn="main"
                justify="between"
                direction={{ initial: 'column', sm: 'row' }}
              >
                <Text size="5" weight="medium">
                  <Skeleton loading={loading}>{date.plus({}).toFormat('EEEE, d MMMM')}</Skeleton>
                </Text>
                {type === 'Workshop' && endTime && (
                  <Text size={{ initial: '4', sm: '5' }} color="gray">
                    <Skeleton loading={loading}>
                      {date.toFormat('h:mma')}–{endTime.toFormat('h:mma')}
                    </Skeleton>
                  </Text>
                )}
              </Flex>
            </Box>
            <Grid
              className={classes.activities}
              columns={{ initial: '1', xs: '2', sm: '3', md: '4', lg: '4' }}
              gap="4"
            >
              {activities.map(({ activity }) => (
                <ActivityCard key={activity.id} activity={activity} loading={loading} />
              ))}
            </Grid>
          </section>
        );
      })}
    </>
  );
};
