import React from 'react';
import { Link } from 'react-router-dom';
import { useTypedParams } from 'react-router-typesafe-routes/dom';

import Button from '@/atoms/Button';
import { ActivityType } from '@/graphql/types';
import Breadcrumbs from '@/molecules/Breadcrumbs';
import PageHeader from '@/molecules/PageHeader';
import Tabs from '@/molecules/Tabs';
import { ROUTES } from '@/Routes';

import ActivityTab from './ActivityTab';
import ActivityTable from './ActivityTable';

export const Component: React.FC = () => {
  const { year, type: pluralizedType } = useTypedParams(ROUTES.ADMIN.FESTIVAL.ACTIVITIES);

  const type = pluralizedType.slice(0, -1) as ActivityType;

  if (!year || !year.match(/^\d{4}$/)) return null;

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
      <ActivityTable year={year} type={type} />
    </div>
  );
};

Component.displayName = 'Activities';

export default Component;
