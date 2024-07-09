import { IconSize } from '@/components/atoms/Icon';
import { icon, namedIcon } from '@ladle/helpers/icons';
import { size } from '@ladle/helpers/size';
import type { Story, StoryDefault } from '@ladle/react';
import { TextInput, TextInputProps } from '@mantine/core';

type TextInputStoryProps = TextInputProps & {
  leftSection?: string;
  rightSection?: string;
};

const TextInputStory: Story<TextInputStoryProps> = ({
  color,
  leftSection,
  rightSection,
  size,
  ...props
}) => (
  <TextInput
    size={size}
    data-color={color}
    leftSection={namedIcon(leftSection, size as IconSize)}
    rightSection={namedIcon(rightSection, size as IconSize)}
    {...props}
  />
);

export { TextInputStory as TextInput };

export default {
  title: 'Atoms',
  args: {
    color: 'primary',
    description: '',
    error: '',
    label: 'Enter text',
    size: 'md',
    variant: 'default',
  } satisfies TextInputStoryProps,
  argTypes: {
    leftSection: icon,
    required: {
      control: {
        type: 'boolean',
      },
    },
    rightSection: icon,
    size,
    variant: {
      control: {
        type: 'select',
      },
      options: ['default', 'filled', 'unstyled'],
    },
  },
} satisfies StoryDefault;
