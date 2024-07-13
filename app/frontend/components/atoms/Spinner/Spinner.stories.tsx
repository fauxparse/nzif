import type { StoryDefault } from '@ladle/react';
import { Spinner, SpinnerProps } from '.';

const SpinnerStory = (props: SpinnerProps) => <Spinner {...props} />;

export { SpinnerStory as Spinner };

export default {
  title: 'Atoms',
  args: {
    size: '2',
  },
  argTypes: {
    size: {
      options: ['1', '2', '3', '4', 'full'],
      control: {
        type: 'select',
      },
    },
  },
} satisfies StoryDefault;
