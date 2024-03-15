import ActivityCard, { ActivityCardActivity } from './ActivityCard';
import { ActivityType } from '@/graphql/types';
import { useActivityGroups } from './useActivityGroups';
import { DateTime } from 'luxon';
import Skeleton from '@/components/helpers/Skeleton';

import './ActivityList.css';

type ActivityListProps = {
  type: ActivityType;
  activities: ActivityCardActivity[];
  loading?: boolean;
};

const ActivityList: React.FC<ActivityListProps> = ({ type, activities, loading = false }) => {
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
          <div className="activity-list__activities" data-activity-type={type}>
            {activities.map(({ activity }) => (
              <ActivityCard key={activity.id} activity={activity} loading={loading} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
};

export default ActivityList;
