import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ActivityType } from '@/graphql/types';
import Breadcrumbs from '@/molecules/Breadcrumbs';
import Tabs from '@/molecules/Tabs';

import ActivityTab from './ActivityTab';

type ActivitiesProps = {
  type: ActivityType;
};

const Activities: React.FC<ActivitiesProps> = ({ type }) => {
  const { year } = useParams<{ year: string }>();

  const [tab, setTab] = useState<ActivityType>(type);

  return (
    <div className="activities">
      <header className="page__header">
        <Breadcrumbs />
        <h1>Activities</h1>
        <Tabs>
          {Object.values(ActivityType).map((type) => (
            <ActivityTab key={type} type={type} />
          ))}
        </Tabs>
      </header>
      <div className="activities__list"></div>
    </div>
  );
};

export default Activities;
