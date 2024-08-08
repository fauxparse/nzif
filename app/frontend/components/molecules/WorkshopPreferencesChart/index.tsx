import { mapKeys, orderBy } from 'lodash-es';
import React, { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Input = {
  name: string;
  id: string;
  counts: Record<`${number}`, number | undefined>;
};

type Datapoint = {
  id: string;
  name: string;
  p1: number;
  p2: number;
  p3: number;
  p4: number;
};

export const WorkshopPreferencesChart: React.FC<{ data: Input[] }> = ({ data }) => {
  const datapoints = useMemo<Datapoint[]>(
    () =>
      orderBy(
        data.map(({ counts, ...d }) => ({
          ...d,
          p1: 0,
          p2: 0,
          p3: 0,
          p4: 0,
          ...mapKeys(counts, (_, k) => `p${k}`),
        })),
        ['p1', 'p2', 'p3', 'p4'],
        ['desc', 'desc', 'desc', 'desc']
      ),
    [data]
  );

  return (
    <ResponsiveContainer width="100%" height={1200}>
      <BarChart
        width={500}
        height={300}
        data={datapoints}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} verticalValues={[16]} />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={250} />
        <Tooltip />
        <Legend />
        <Bar dataKey="p1" name="First" stackId="a" fill="var(--crimson-9)" />
        <Bar dataKey="p2" name="Second" stackId="a" fill="var(--crimson-8)" />
        <Bar dataKey="p3" name="Third" stackId="a" fill="var(--crimson-7)" />
        <Bar dataKey="p4" name="Fourth" stackId="a" fill="var(--crimson-6)" />
      </BarChart>
    </ResponsiveContainer>
  );
};
