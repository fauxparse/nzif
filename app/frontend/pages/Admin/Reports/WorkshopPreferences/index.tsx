import React, { useMemo } from 'react';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { sortBy } from 'lodash-es';

import { useWorkshopPreferencesQuery, WorkshopPreferencesQuery } from '@/graphql/types';

import Chart from './Chart';

type Workshop = WorkshopPreferencesQuery['festival']['activities'][number] & {
  __typename: 'Workshop';
};

export const Component: React.FC = () => {
  const { data } = useWorkshopPreferencesQuery();

  const workshops = useMemo(() => {
    if (!data) return [];

    return sortBy(
      (data.festival.activities as Workshop[]).map(({ stats, ...workshop }) => ({
        ...workshop,
        first: stats.counts[0] ?? 0,
        second: stats.counts[1] ?? 0,
        third: stats.counts[2] ?? 0,
      })),
      'first'
    );
  }, [data]);

  const height = 33 * 32;

  return (
    <div className="inset">
      <h1>Workshop Preferences</h1>

      {workshops.length > 0 && (
        <ParentSize className="graph-container" debounceTime={10}>
          {({ width }) => <Chart data={workshops} width={width} height={height} />}
        </ParentSize>
      )}
    </div>
  );
};

Component.displayName = 'WorkshopPreferences';
