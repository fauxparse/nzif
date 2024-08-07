import { groupBy, orderBy } from 'lodash-es';
import React from 'react';
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

const DATA = [
  {
    name: 'Skills for long-form improv',
    id: 127,
    position: 4,
    count: 1,
  },
  {
    name: 'Skills for long-form improv',
    id: 127,
    position: 1,
    count: 12,
  },
  {
    name: 'Skills for long-form improv',
    id: 127,
    position: 2,
    count: 1,
  },
  {
    name: 'Skills for long-form improv',
    id: 127,
    position: 5,
    count: 2,
  },
  {
    name: 'Amping up your yarns',
    id: 120,
    position: 2,
    count: 6,
  },
  {
    name: 'Amping up your yarns',
    id: 120,
    position: 1,
    count: 18,
  },
  {
    name: 'Respond with your emotional body',
    id: 126,
    position: 2,
    count: 6,
  },
  {
    name: 'Respond with your emotional body',
    id: 126,
    position: 3,
    count: 2,
  },
  {
    name: 'Respond with your emotional body',
    id: 126,
    position: 1,
    count: 10,
  },
  {
    name: 'Let’s get political!',
    id: 133,
    position: 4,
    count: 2,
  },
  {
    name: 'Let’s get political!',
    id: 133,
    position: 1,
    count: 7,
  },
  {
    name: 'Let’s get political!',
    id: 133,
    position: 2,
    count: 2,
  },
  {
    name: 'Let’s get political!',
    id: 133,
    position: 3,
    count: 3,
  },
  {
    name: 'Baking delicious improv with high-quality ingredients',
    id: 109,
    position: 2,
    count: 6,
  },
  {
    name: 'Baking delicious improv with high-quality ingredients',
    id: 109,
    position: 1,
    count: 7,
  },
  {
    name: 'Baking delicious improv with high-quality ingredients',
    id: 109,
    position: 3,
    count: 1,
  },
  {
    name: 'Songs from a spellbound city',
    id: 110,
    position: 3,
    count: 2,
  },
  {
    name: 'Songs from a spellbound city',
    id: 110,
    position: 1,
    count: 15,
  },
  {
    name: 'Songs from a spellbound city',
    id: 110,
    position: 2,
    count: 2,
  },
  {
    name: 'Preparing for song',
    id: 101,
    position: 1,
    count: 11,
  },
  {
    name: 'Preparing for song',
    id: 101,
    position: 2,
    count: 10,
  },
  {
    name: 'Preparing for song',
    id: 101,
    position: 3,
    count: 1,
  },
  {
    name: 'Tumbling down a hill',
    id: 106,
    position: 3,
    count: 1,
  },
  {
    name: 'Tumbling down a hill',
    id: 106,
    position: 1,
    count: 9,
  },
  {
    name: 'Tumbling down a hill',
    id: 106,
    position: 2,
    count: 9,
  },
  {
    name: 'Stuck with you',
    id: 121,
    position: 3,
    count: 3,
  },
  {
    name: 'Stuck with you',
    id: 121,
    position: 2,
    count: 7,
  },
  {
    name: 'Stuck with you',
    id: 121,
    position: 1,
    count: 6,
  },
  {
    name: 'Playing generously',
    id: 107,
    position: 2,
    count: 7,
  },
  {
    name: 'Playing generously',
    id: 107,
    position: 3,
    count: 3,
  },
  {
    name: 'Playing generously',
    id: 107,
    position: 1,
    count: 4,
  },
  {
    name: 'Meisner technique and improv',
    id: 112,
    position: 2,
    count: 6,
  },
  {
    name: 'Meisner technique and improv',
    id: 112,
    position: 1,
    count: 4,
  },
  {
    name: 'Meisner technique and improv',
    id: 112,
    position: 3,
    count: 1,
  },
  {
    name: "Jane and Connor's workshop",
    id: 168,
    position: 2,
    count: 3,
  },
  {
    name: "Jane and Connor's workshop",
    id: 168,
    position: 4,
    count: 2,
  },
  {
    name: "Jane and Connor's workshop",
    id: 168,
    position: 3,
    count: 4,
  },
  {
    name: "Jane and Connor's workshop",
    id: 168,
    position: 1,
    count: 4,
  },
  {
    name: 'Teaching the teacher',
    id: 104,
    position: 1,
    count: 13,
  },
  {
    name: 'Teaching the teacher',
    id: 104,
    position: 2,
    count: 4,
  },
  {
    name: 'Teaching the teacher',
    id: 104,
    position: 3,
    count: 1,
  },
  {
    name: 'Improv’s unfair',
    id: 130,
    position: 1,
    count: 10,
  },
  {
    name: 'Improv’s unfair',
    id: 130,
    position: 2,
    count: 13,
  },
  {
    name: 'Improv’s unfair',
    id: 130,
    position: 4,
    count: 2,
  },
  {
    name: 'Improv’s unfair',
    id: 130,
    position: 3,
    count: 2,
  },
  {
    name: 'Vocal co-lab',
    id: 103,
    position: 1,
    count: 8,
  },
  {
    name: 'Vocal co-lab',
    id: 103,
    position: 4,
    count: 2,
  },
  {
    name: 'Vocal co-lab',
    id: 103,
    position: 3,
    count: 3,
  },
  {
    name: 'Vocal co-lab',
    id: 103,
    position: 2,
    count: 4,
  },
  {
    name: 'Positioning, power, and presence',
    id: 122,
    position: 3,
    count: 3,
  },
  {
    name: 'Positioning, power, and presence',
    id: 122,
    position: 1,
    count: 13,
  },
  {
    name: 'Positioning, power, and presence',
    id: 122,
    position: 2,
    count: 6,
  },
  {
    name: 'Put through your paces',
    id: 111,
    position: 4,
    count: 2,
  },
  {
    name: 'Put through your paces',
    id: 111,
    position: 2,
    count: 5,
  },
  {
    name: 'Put through your paces',
    id: 111,
    position: 3,
    count: 4,
  },
  {
    name: 'Put through your paces',
    id: 111,
    position: 1,
    count: 4,
  },
  {
    name: 'Mastering character voices',
    id: 113,
    position: 2,
    count: 8,
  },
  {
    name: 'Mastering character voices',
    id: 113,
    position: 3,
    count: 6,
  },
  {
    name: 'Mastering character voices',
    id: 113,
    position: 1,
    count: 11,
  },
  {
    name: 'It’s us in the end',
    id: 114,
    position: 3,
    count: 2,
  },
  {
    name: 'It’s us in the end',
    id: 114,
    position: 1,
    count: 19,
  },
  {
    name: 'It’s us in the end',
    id: 114,
    position: 2,
    count: 5,
  },
  {
    name: 'Narration',
    id: 115,
    position: 3,
    count: 9,
  },
  {
    name: 'Narration',
    id: 115,
    position: 2,
    count: 11,
  },
  {
    name: 'Narration',
    id: 115,
    position: 1,
    count: 3,
  },
  {
    name: 'An offer you can refuse',
    id: 124,
    position: 3,
    count: 4,
  },
  {
    name: 'An offer you can refuse',
    id: 124,
    position: 2,
    count: 9,
  },
  {
    name: 'An offer you can refuse',
    id: 124,
    position: 1,
    count: 5,
  },
  {
    name: 'Zip it: we’re talking about costuming',
    id: 128,
    position: 4,
    count: 1,
  },
  {
    name: 'Zip it: we’re talking about costuming',
    id: 128,
    position: 1,
    count: 2,
  },
  {
    name: 'Zip it: we’re talking about costuming',
    id: 128,
    position: 3,
    count: 3,
  },
  {
    name: 'Improv beyond words',
    id: 116,
    position: 2,
    count: 10,
  },
  {
    name: 'Improv beyond words',
    id: 116,
    position: 3,
    count: 3,
  },
  {
    name: 'Improv beyond words',
    id: 116,
    position: 1,
    count: 5,
  },
  {
    name: 'There used to be magic, once',
    id: 117,
    position: 2,
    count: 3,
  },
  {
    name: 'There used to be magic, once',
    id: 117,
    position: 3,
    count: 2,
  },
  {
    name: 'There used to be magic, once',
    id: 117,
    position: 1,
    count: 16,
  },
  {
    name: 'Big shoes',
    id: 118,
    position: 1,
    count: 5,
  },
  {
    name: 'Big shoes',
    id: 118,
    position: 3,
    count: 6,
  },
  {
    name: 'Big shoes',
    id: 118,
    position: 2,
    count: 10,
  },
  {
    name: 'Playing from your gut',
    id: 125,
    position: 4,
    count: 1,
  },
  {
    name: 'Playing from your gut',
    id: 125,
    position: 3,
    count: 2,
  },
  {
    name: 'Playing from your gut',
    id: 125,
    position: 2,
    count: 8,
  },
  {
    name: 'Playing from your gut',
    id: 125,
    position: 1,
    count: 7,
  },
  {
    name: 'Impro sensoriál',
    id: 129,
    position: 1,
    count: 6,
  },
  {
    name: 'Impro sensoriál',
    id: 129,
    position: 2,
    count: 6,
  },
  {
    name: 'Impro sensoriál',
    id: 129,
    position: 3,
    count: 5,
  },
  {
    name: 'Impro sensoriál',
    id: 129,
    position: 4,
    count: 1,
  },
  {
    name: 'Embracing the ephemeral',
    id: 102,
    position: 2,
    count: 8,
  },
  {
    name: 'Embracing the ephemeral',
    id: 102,
    position: 1,
    count: 8,
  },
  {
    name: 'Embracing the ephemeral',
    id: 102,
    position: 3,
    count: 1,
  },
  {
    name: 'Past, present, future',
    id: 131,
    position: 2,
    count: 5,
  },
  {
    name: 'Past, present, future',
    id: 131,
    position: 3,
    count: 8,
  },
  {
    name: 'Past, present, future',
    id: 131,
    position: 1,
    count: 5,
  },
  {
    name: 'Past, present, future',
    id: 131,
    position: 4,
    count: 2,
  },
  {
    name: 'Long-form formatting',
    id: 170,
    position: 2,
    count: 7,
  },
  {
    name: 'Long-form formatting',
    id: 170,
    position: 4,
    count: 2,
  },
  {
    name: 'Long-form formatting',
    id: 170,
    position: 1,
    count: 5,
  },
  {
    name: 'Long-form formatting',
    id: 170,
    position: 3,
    count: 2,
  },
  {
    name: 'Improv Masala',
    id: 123,
    position: 1,
    count: 13,
  },
  {
    name: 'Improv Masala',
    id: 123,
    position: 2,
    count: 3,
  },
  {
    name: 'Improv Masala',
    id: 123,
    position: 3,
    count: 5,
  },
  {
    name: 'Bodyworks',
    id: 99,
    position: 6,
    count: 1,
  },
  {
    name: 'Bodyworks',
    id: 99,
    position: 1,
    count: 8,
  },
  {
    name: 'Bodyworks',
    id: 99,
    position: 2,
    count: 1,
  },
  {
    name: 'Kultura',
    id: 119,
    position: 2,
    count: 3,
  },
  {
    name: 'Kultura',
    id: 119,
    position: 3,
    count: 6,
  },
  {
    name: 'Kultura',
    id: 119,
    position: 1,
    count: 3,
  },
  {
    name: 'Ludicrously improbable',
    id: 105,
    position: 3,
    count: 3,
  },
  {
    name: 'Ludicrously improbable',
    id: 105,
    position: 2,
    count: 10,
  },
  {
    name: 'Ludicrously improbable',
    id: 105,
    position: 1,
    count: 4,
  },
] as const;

type Datapoint = {
  id: number;
  name: string;
  p1: number;
  p2: number;
  p3: number;
  p4: number;
};

const data = orderBy(
  Object.values(groupBy(DATA, 'id')).map((group) =>
    group.reduce(
      (acc, { name, id, position, count }) =>
        Object.assign(acc, { name, id, [`p${position}`]: count }),
      { name: '', id: 0, p1: 0, p2: 0, p3: 0, p4: 0 } as Datapoint
    )
  ),
  ['p1', 'p2', 'p3', 'p4'],
  ['desc', 'desc', 'desc', 'desc']
);

export const WorkshopPreferencesChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={1200}>
      <BarChart
        width={500}
        height={300}
        data={data}
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
        <Bar dataKey="p1" stackId="a" fill="var(--crimson-9)" />
        <Bar dataKey="p2" stackId="a" fill="var(--crimson-8)" />
        <Bar dataKey="p3" stackId="a" fill="var(--crimson-7)" />
        <Bar dataKey="p4" stackId="a" fill="var(--crimson-6)" />
      </BarChart>
    </ResponsiveContainer>
  );
};
