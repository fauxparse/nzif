import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { kebabCase } from 'lodash-es';
import pluralize from 'pluralize';

import { ActivityType, useFestivalQuery } from '@/graphql/types';
import { BreadcrumbProvider } from '@/molecules/Breadcrumbs';

import Activities from './Activities';
import FestivalContext from './FestivalContext';
import Timetable from './Timetable';

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
          <Route path="timetable" element={<Timetable />} />
        </Routes>
      </FestivalContext.Provider>
    </BreadcrumbProvider>
  );
};

export default Festival;
