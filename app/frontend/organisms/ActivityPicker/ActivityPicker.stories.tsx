import type { Meta, StoryObj } from '@storybook/react';
import { kebabCase, uniqueId } from 'lodash-es';
import React from 'react';

import { ActivityType } from '@/graphql/types';

import { ActivityPicker } from './ActivityPicker';
import { ActivityResult } from './ActivityPicker.types';

type Story = StoryObj<typeof ActivityPicker>;

const WORKSHOPS = [
  'Stories of the Darkest Night',
  'Tales From The Tip',
  'Swipe Right',
  'The Greatest Show',
  'Just the Two Of Us',
  'Livin’ La Impro Loca',
  'Space Patrol 5',
  'ImprovFX - Technology and Improvisational Theatre',
  'Playing with yourself: Solo exercises for learning to be comfortable and have fun at all times!',
  'Sliding Doors',
  'Unarmed Stage Fighting for Improvisers ',
  'The Awakening of the Clown ',
  'The Protest',
  'Calling it Back',
  'Physical Theatre & Mime',
  'Language Improv',
  '3D Characters',
  'Play like an ally',
  'Scene Work: The Chicago Way',
  'Free-form Improvisation',
  'Finding Strength in Vulnerability',
  'Ditching Expectations',
  'Romance and Adventure ',
  'Train like a Troupe',
  'Love Isthmus: Dystopia Edition',
  'On The Spot Musicals',
  'The Werk It Werkshop',
  'Chopping Carrots',
  'Heartfelt High',
  'Personal Storytelling for Stage',
  "(The Return of) The Unicorn's Story Cabaret",
  'Strangers',
  'Hugging the Cactus',
].map(
  (name): ActivityResult => ({
    __typename: 'ActivityResult',
    id: uniqueId(),
    title: name,
    description: 'Workshop',
    url: '',
    activity: {
      __typename: 'Workshop',
      id: uniqueId(),
      name,
      slug: kebabCase(name),
      type: ActivityType.Workshop,
      tutors: [],
    },
  })
);

export default {
  title: 'Organisms/ActivityPicker',
  component: ActivityPicker,
  argTypes: {},
  args: {
    activityType: ActivityType.Workshop,
  },
  render: (args) => <ActivityPicker {...args} />,
} satisfies Meta<typeof ActivityPicker>;

export const Default: Story = {
  args: {
    onSearch: (query) =>
      new Promise<ActivityResult[]>((resolve) => {
        const regex = new RegExp(query, 'i');
        setTimeout(() => resolve(WORKSHOPS.filter((w) => w.activity.name.match(regex))), 1000);
      }),
  },
};
