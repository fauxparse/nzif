import { Container } from '@mantine/core';
import ActivityCard, { ActivityCardActivity } from './ActivityCard';

import './ActivityList.css';
import { ActivityType } from '@/graphql/types';

type ActivityListProps = {
  type: ActivityType;
  activities: ActivityCardActivity[];
};

const ActivityList: React.FC<ActivityListProps> = ({ type, activities }) => {
  return (
    <Container>
      <div className="activity-list__activities" data-activity-type={type}>
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </Container>
  );
};

export default ActivityList;
