import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { kebabCase } from 'lodash-es';
import pluralize from 'pluralize';

import { ActivityType, useFestivalQuery } from '@/graphql/types';
import { BreadcrumbProvider } from '@/molecules/Breadcrumbs';

import Activities from './Activities';
import Dashboard from './Dashboard';
import FestivalContext from './FestivalContext';
import People from './People';
import Timetable from './Timetable';
import Translations from './Translations';

const Festival: React.FC = () => {
  const { year } = useParams<{ year: string }>() as { year: string };

  const { data } = useFestivalQuery({ variables: { year } });

  if (!data?.festival) return null;

  return (
    <BreadcrumbProvider label={year} path={year}>
      <FestivalContext.Provider value={{ festival: data.festival }}>
        <Routes>
          {Object.entries(ActivityType).map(([key, value]) => (
            <Route
              key={key}
              path={`${kebabCase(pluralize(key))}/*`}
              element={<Activities type={value} />}
            />
          ))}
          <Route path="people/*" element={<People />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="translations" element={<Translations />} />
          <Route index element={<Dashboard />} />
        </Routes>
      </FestivalContext.Provider>
    </BreadcrumbProvider>
  );
};

export default Festival;
