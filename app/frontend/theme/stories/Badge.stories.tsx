import CloseIcon from '@/icons/CloseIcon';
import { icon, namedIcon } from '@ladle/helpers/icons';
import type { Story, StoryDefault } from '@ladle/react';
import { ActionIcon, Badge, BadgeProps } from '@mantine/core';

type BadgeStoryProps = Pick<BadgeProps, 'size' | 'variant' | 'radius' | 'circle'> & {
  close: boolean;
  color: string;
  label: string;
  leftSection: string;
  rightSection: string;
};

const BadgeStory: Story<BadgeStoryProps> = ({
  close,
  color,
  label,
  leftSection,
  rightSection,
  size,
  ...props
}) => (
  <Badge
    size={size}
    data-color={color}
    leftSection={namedIcon(leftSection)}
    rightSection={
      close ? (
        <ActionIcon size={`compact-${size}`} data-color={color} variant="transparent">
          <CloseIcon />
        </ActionIcon>
      ) : (
        namedIcon(rightSection)
      )
    }
    {...props}
  >
    {label}
  </Badge>
);

export { BadgeStory as Badge };

export default {
  title: 'Atoms',
  args: {
    circle: false,
    close: false,
    color: 'primary',
    label: 'Badge text',
    radius: 'xl',
    size: 'md',
    variant: 'default',
  },
  argTypes: {
    circle: {
      control: {
        type: 'boolean',
      },
    },
    close: {
      control: {
        type: 'boolean',
      },
    },
    color: {
      control: {
        type: 'select',
      },
      options: ['neutral', 'primary', 'cyan', 'magenta', 'yellow'],
    },
    leftSection: icon,
    radius: {
      control: {
        type: 'select',
      },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    rightSection: icon,
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
      options: ['default', 'filled', 'light', 'outline', 'dot', 'transparent', 'white'],
    },
  },
} satisfies StoryDefault;
