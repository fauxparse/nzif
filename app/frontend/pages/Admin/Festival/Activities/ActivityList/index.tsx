import React from 'react';
import { Link, useParams } from 'react-router-dom';

import Button from '@/atoms/Button';
import { ActivityType } from '@/graphql/types';
import Breadcrumbs from '@/molecules/Breadcrumbs';
import Tabs from '@/molecules/Tabs';

import ActivityTab from './ActivityTab';
import ActivityTable from './ActivityTable';

type ActivitiesProps = {
  type: ActivityType;
};

const Activities: React.FC<ActivitiesProps> = ({ type }) => {
  const { year } = useParams<{ year: string }>() as { year: string };

  if (!year || !year.match(/^\d{4}$/)) return null;

  return (
    <div className="page">
      <header className="page__header">
        <Breadcrumbs />
        <h1>Activities</h1>
        <Tabs>
          {Object.entries(ActivityType).map(([key, value]) => (
            <ActivityTab key={key} type={value} />
          ))}
          <Button ghost as={Link} to={`../timetable`} icon="calendar" text="Timetable" />
        </Tabs>
      </header>
      <ActivityTable type={type} />
    </div>
  );
};

export default Activities;
