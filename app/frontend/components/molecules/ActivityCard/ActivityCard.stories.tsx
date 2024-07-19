import { ActivityType } from '@/graphql/types';
import { StoryDefault } from '@ladle/react';
import { DateTime } from 'luxon';
import React from 'react';
import { ActivityCard, ActivityCardProps } from '.';

const ActivityCardStory: React.FC<ActivityCardProps> = ({ loading, size }) => (
  <ActivityCard
    loading={loading}
    size={size}
    activity={
      {
        __typename: 'Workshop',
        id: '1',
        slug: 'test',
        name: 'Test activity',
        picture: {
          id: '1',
          medium:
            'https://images.bauerhosting.com/legacy/lifestyle-legacy/d4/825e3/c8968/77355/69c09/dabbc/778f7/muscle-women-hero_620x349.jpg?ar=16%3A9&fit=crop&crop=top&auto=format&w=1200&q=80',
          blurhash: 'LZI6g8-nT#og0PWBRPo#s:W?oIaJ',
        },
        type: ActivityType.Workshop,
        show: {
          id: '2',
          name: 'A show',
        },
        sessions: [
          {
            id: '1',
            startsAt: DateTime.local(2024, 10, 4, 10),
            endsAt: DateTime.local(2024, 10, 4, 13),
          },
        ],
        presenters: [
          {
            id: '1',
            name: 'Lauren Ipsum',
            city: {
              id: '1',
              name: 'Wellington',
              traditionalNames: ['Pōneke'],
              country: 'nz',
            },
          },
        ],
      } as ActivityCardProps['activity']
    }
  />
);

export { ActivityCardStory as ActivityCard };

export default {
  title: 'Molecules',
  args: {
    loading: false,
    size: '2',
  },
  argTypes: {
    size: {
      options: ['1', '2'],
      control: {
        type: 'select',
      },
    },
  },
} satisfies StoryDefault;
