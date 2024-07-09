import { size } from '@ladle/helpers/size';
import { Story, StoryDefault } from '@ladle/react';
import { CloseButton, CloseButtonProps } from '@mantine/core';

type CloseButtonStoryProps = CloseButtonProps;

const CloseButtonStory: Story<CloseButtonStoryProps> = ({ ...props }) => <CloseButton {...props} />;

export { CloseButtonStory as CloseButton };

export default {
  title: 'Atoms',
  args: {},
  argTypes: {
    size,
  },
} satisfies StoryDefault;
