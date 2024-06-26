import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { sortBy } from 'lodash-es';
import React, { useMemo, useState } from 'react';

import { WorkshopPreferencesQuery, useWorkshopPreferencesQuery } from '@/graphql/types';
import Breadcrumbs from '@/molecules/Breadcrumbs';
import PageHeader from '@/molecules/PageHeader';
import Tabs from '@/molecules/Tabs';

import Chart from './Chart';
import PreferencesBySession from './PreferencesBySession';

type Workshop = WorkshopPreferencesQuery['festival']['activities'][number] & {
  __typename: 'Workshop';
};

type View = 'chart' | 'table';

export const Component: React.FC = () => {
  const { data } = useWorkshopPreferencesQuery();

  const [view, setView] = useState<View>('chart');

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

  return (
    <div>
      <PageHeader>
        <Breadcrumbs />
        <h1>Workshop preferences</h1>

        <Tabs>
          <Tabs.Tab text="Chart" selected={view === 'chart'} onClick={() => setView('chart')} />
          <Tabs.Tab text="Table" selected={view === 'table'} onClick={() => setView('table')} />
        </Tabs>
      </PageHeader>

      {view === 'chart' && (
        <div className="inset">
          {workshops.length > 0 && (
            <ParentSize className="graph-container" debounceTime={10}>
              {({ width }) => <Chart data={workshops} width={width} />}
            </ParentSize>
          )}
        </div>
      )}
      {view === 'table' && (
        <div>{data && <PreferencesBySession data={data.festival.activities} />}</div>
      )}
    </div>
  );
};

Component.displayName = 'WorkshopPreferences';
