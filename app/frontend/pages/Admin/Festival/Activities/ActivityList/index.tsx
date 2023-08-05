import React from 'react';
import { Link } from 'react-router-dom';
import { useTypedParams } from 'react-router-typesafe-routes/dom';

import Button from '@/atoms/Button';
import { ActivityType } from '@/graphql/types';
import Breadcrumbs from '@/molecules/Breadcrumbs';
import PageHeader from '@/molecules/PageHeader';
import Tabs from '@/molecules/Tabs';
import { ROUTES } from '@/Routes';
import { activityTypeFromPluralized, Pluralized } from '@/util/activityTypeLabel';

import ActivityTab from './ActivityTab';
import ActivityTable from './ActivityTable';

import './ActivityList.css';

export const Component: React.FC = () => {
  const { type: pluralizedType } = useTypedParams(ROUTES.ADMIN.ACTIVITIES);

  const type = activityTypeFromPluralized(pluralizedType as Pluralized);

  return (
    <div className="page">
      <PageHeader>
        <Breadcrumbs />
        <h1>Activities</h1>
        <Tabs>
          {Object.entries(ActivityType).map(([key, value]) => (
            <ActivityTab key={key} type={value} />
          ))}
          <Button ghost as={Link} to={`../timetable`} icon="calendar" text="Timetable" />
        </Tabs>
      </PageHeader>
      <ActivityTable type={type} />
    </div>
  );
};

Component.displayName = 'Activities';

export default Component;
