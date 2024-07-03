import Skeleton from '@/components/helpers/Skeleton';
import { ActivityType } from '@/graphql/types';
import { DateTime } from 'luxon';
import ActivityCard, { ActivityCardActivity } from './ActivityCard';
import { useActivityGroups } from './useActivityGroups';

import './ActivityList.css';
import { Grid } from '@radix-ui/themes';

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
  const endTime =
    type === ActivityType.Workshop && activities.length > 0 && activities[0].sessions[0].endsAt;

  return (
    <>
      {days.map(([date, activities]) => (
        <section key={date.toISO()} className="activity-list__day">
          <div className="activity-list__day-header">
            <div className="activity-list__date">
              {loading ? (
                <Skeleton height="1em" width="7em" />
              ) : (
                date.toLocaleString(DateTime.DATE_FULL)
              )}
            </div>
            {endTime && (
              <div className="activity-list__time">
                {loading ? (
                  <Skeleton height="1em" width="7em" />
                ) : (
                  `${date.toFormat('h:mma')}–${endTime.toFormat('h:mma')}`
                )}
              </div>
            )}
          </div>
          <Grid columns={{ initial: '1', xs: '2', sm: '3', md: '4', lg: '4' }} gap="4">
            {activities.map(({ activity }) => (
              <ActivityCard key={activity.id} activity={activity} loading={loading} />
            ))}
          </Grid>
        </section>
      ))}
    </>
  );
};
