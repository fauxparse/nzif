import { IconSize } from '@/components/atoms/Icon';
import { icon, namedIcon } from '@ladle/helpers/icons';
import { Story, StoryDefault } from '@ladle/react';
import { ActionIcon, ActionIconProps } from '@mantine/core';

type ActionIconStoryProps = Pick<ActionIconProps, 'size' | 'variant' | 'disabled' | 'loading'> & {
  color: string;
  compact: boolean;
  icon: string;
};

const ActionIconStory: Story<ActionIconStoryProps> = ({
  color,
  compact,
  icon = 'Close',
  size = 'md',
  ...props
}) => (
  <ActionIcon
    size={`${compact ? 'compact-' : ''}${size}`}
    data-color={color}
    loaderProps={{ type: 'dots' }}
    {...props}
  >
    {namedIcon(icon, size as IconSize)}
  </ActionIcon>
);

export { ActionIconStory as ActionIcon };

export default {
  title: 'Atoms',
  args: {
    color: 'neutral',
    compact: false,
    disabled: false,
    loading: false,
    size: 'md',
    variant: 'subtle',
  },
  argTypes: {
    color: {
      control: {
        type: 'select',
      },
      options: ['neutral', 'primary', 'cyan', 'magenta', 'yellow'],
    },
    compact: {
      control: {
        type: 'boolean',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    icon: icon,
    loading: {
      control: {
        type: 'boolean',
      },
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: {
        type: 'select',
      },
      options: ['default', 'filled', 'light', 'outline', 'subtle', 'transparent', 'white'],
    },
  },
} satisfies StoryDefault;
