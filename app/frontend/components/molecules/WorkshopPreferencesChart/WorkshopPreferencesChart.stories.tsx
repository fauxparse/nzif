import { StoryDefault } from '@ladle/react';
import { WorkshopPreferencesChart } from './index';

const DATA = [
  {
    id: 'Pe7G1e',
    name: 'Vocal co-lab',
    counts: {
      '1': 8,
      '2': 4,
      '3': 3,
      '4': 2,
    },
  },
  {
    id: 'Y31oXA',
    name: 'Following your joy',
    counts: {
      '1': 1,
      '2': 1,
      '3': 10,
      '4': 1,
    },
  },
  {
    id: 'BAGooA',
    name: "Jane and Connor's workshop",
    counts: {
      '1': 4,
      '2': 1,
      '3': 4,
      '4': 2,
    },
  },
  {
    id: 'dAn27A',
    name: 'Ludicrously improbable',
    counts: {
      '1': 4,
      '2': 10,
      '3': 4,
    },
  },
  {
    id: 'LedZv5',
    name: 'Embracing the ephemeral',
    counts: {
      '1': 9,
      '2': 6,
      '3': 1,
      '4': 1,
    },
  },
  {
    id: 'b3vp4A',
    name: 'Improv Masala',
    counts: {
      '1': 12,
      '2': 3,
      '3': 5,
    },
  },
  {
    id: 'W38x13',
    name: 'Preparing for song',
    counts: {
      '1': 9,
      '2': 12,
      '3': 1,
    },
  },
  {
    id: 'Ve9Yxe',
    name: 'Let’s get political!',
    counts: {
      '1': 7,
      '2': 2,
      '3': 3,
      '4': 2,
    },
  },
  {
    id: 'P5joo3',
    name: 'Respond with your emotional body',
    counts: {
      '1': 9,
      '2': 6,
      '3': 2,
    },
  },
  {
    id: 'R3Znr3',
    name: 'Narration',
    counts: {
      '1': 3,
      '2': 11,
      '3': 8,
    },
  },
  {
    id: 'g3Ezbe',
    name: 'Improv beyond words',
    counts: {
      '1': 5,
      '2': 10,
      '3': 3,
    },
  },
  {
    id: 'JABoz5',
    name: 'Baking delicious improv with high-quality ingredients',
    counts: {
      '1': 5,
      '2': 6,
      '3': 1,
    },
  },
  {
    id: 'xAm2W5',
    name: 'Songs from a spellbound city',
    counts: {
      '1': 14,
      '2': 2,
      '3': 2,
    },
  },
  {
    id: '73R9Q5',
    name: 'Playing generously',
    counts: {
      '1': 4,
      '2': 7,
      '3': 3,
    },
  },
  {
    id: 'NegP8A',
    name: 'Put through your paces',
    counts: {
      '1': 3,
      '2': 5,
      '3': 4,
      '4': 2,
    },
  },
  {
    id: 'BeGxoA',
    name: 'Skills for long-form improv',
    counts: {
      '1': 12,
      '2': 1,
      '4': 1,
      '5': 2,
    },
  },
  {
    id: '654BWe',
    name: 'Amping up your yarns',
    counts: {
      '1': 17,
      '2': 5,
    },
  },
  {
    id: 'zeQDR3',
    name: 'There used to be magic, once',
    counts: {
      '1': 16,
      '2': 3,
      '3': 2,
    },
  },
  {
    id: 'z5QDrA',
    name: 'Bodyworks',
    counts: {
      '1': 8,
      '2': 1,
      '7': 1,
    },
  },
  {
    id: 'xeJWZA',
    name: 'Teaching the teacher',
    counts: {
      '1': 12,
      '2': 3,
      '3': 2,
    },
  },
  {
    id: 'XeLjo5',
    name: 'It’s us in the end',
    counts: {
      '1': 17,
      '2': 5,
      '3': 2,
    },
  },
  {
    id: '13W1DA',
    name: 'Long-form formatting',
    counts: {
      '1': 5,
      '2': 6,
      '3': 2,
      '4': 2,
    },
  },
  {
    id: 'w36Mr5',
    name: 'Kultura',
    counts: {
      '1': 2,
      '2': 3,
      '3': 6,
    },
  },
  {
    id: '15WoD5',
    name: 'Impro sensoriál',
    counts: {
      '1': 5,
      '2': 6,
      '3': 5,
      '4': 1,
    },
  },
  {
    id: 'xeMqQe',
    name: 'Mastering character voices',
    counts: {
      '1': 11,
      '2': 6,
      '3': 6,
    },
  },
  {
    id: 'k3Xop5',
    name: 'Playing from your gut',
    counts: {
      '1': 6,
      '2': 7,
      '3': 2,
      '4': 1,
    },
  },
  {
    id: 'Q3yJje',
    name: 'An offer you can refuse',
    counts: {
      '1': 4,
      '2': 8,
      '3': 4,
    },
  },
  {
    id: 'kANqpe',
    name: 'Stuck with you',
    counts: {
      '1': 6,
      '2': 7,
      '3': 3,
    },
  },
  {
    id: 'P5r4qe',
    name: 'Positioning, power, and presence',
    counts: {
      '1': 12,
      '2': 5,
      '3': 3,
    },
  },
  {
    id: 'zAaQLA',
    name: 'Big shoes',
    counts: {
      '1': 4,
      '2': 10,
      '3': 6,
    },
  },
  {
    id: 'P3k4Ne',
    name: 'Tumbling down a hill',
    counts: {
      '1': 9,
      '2': 9,
      '3': 1,
    },
  },
  {
    id: 'W3opje',
    name: 'Improv’s unfair',
    counts: {
      '1': 8,
      '2': 12,
      '3': 2,
      '4': 2,
    },
  },
  {
    id: 'P3YoRA',
    name: 'Meisner technique and improv',
    counts: {
      '1': 4,
      '2': 6,
    },
  },
  {
    id: 'x3qG4A',
    name: 'Zip it: we’re talking about costuming',
    counts: {
      '1': 2,
      '3': 3,
      '4': 1,
    },
  },
  {
    id: 'oAxjP3',
    name: 'Past, present, future',
    counts: {
      '1': 5,
      '2': 4,
      '3': 8,
      '4': 2,
    },
  },
];

const Story = () => <WorkshopPreferencesChart data={DATA} />;

export { Story as WorkshopPreferencesChart };

export default {
  title: 'Molecules',
} satisfies StoryDefault;
