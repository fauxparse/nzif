import type { Story, StoryDefault } from '@ladle/react';
import { Kbd, KbdProps, Text } from '@mantine/core';

type KbdStoryProps = KbdProps & {
  label: string;
};

const KbdStory: Story<KbdStoryProps> = ({ label, ...props }) => (
  <Text size="md">
    Press <Kbd {...props}>{label}</Kbd> to continue
  </Text>
);

export { KbdStory as Kbd };

export default {
  title: 'Atoms',
  args: {
    label: 'Esc',
  },
} satisfies StoryDefault;
