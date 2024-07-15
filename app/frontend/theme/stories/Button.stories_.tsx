import { IconSize } from '@/components/atoms/Icon';
import { icon, namedIcon } from '@ladle/helpers/icons';
import { Story, StoryDefault } from '@ladle/react';
import { Button, ButtonProps } from '@mantine/core';

type ButtonStoryProps = Pick<ButtonProps, 'size' | 'variant' | 'disabled' | 'loading'> & {
  color: string;
  compact: boolean;
  label: string;
  leftSection: string;
  rightSection: string;
};

const ButtonStory: Story<ButtonStoryProps> = ({
  color,
  compact,
  label,
  leftSection,
  rightSection,
  size = 'md',
  ...props
}) => (
  <Button
    size={`${compact ? 'compact-' : ''}${size}`}
    data-color={color}
    leftSection={namedIcon(leftSection, size.replace('compact-', '') as IconSize)}
    rightSection={namedIcon(rightSection, size.replace('compact-', '') as IconSize)}
    loaderProps={{ type: 'dots' }}
    {...props}
  >
    {label}
  </Button>
);

export { ButtonStory as Button };

const ButtonGroupStory: Story<ButtonStoryProps> = ({ label, ...props }) => (
  <Button.Group>
    <ButtonStory label="First" {...props} />
    <ButtonStory label="Second" {...props} />
    <ButtonStory label="Third" {...props} />
  </Button.Group>
);

export { ButtonGroupStory as ButtonGroup };

export default {
  title: 'Atoms',
  args: {
    color: 'neutral',
    compact: false,
    disabled: false,
    fullWidth: false,
    justify: 'center',
    label: 'Button text',
    loading: false,
    size: 'md',
    variant: 'default',
  },
  argTypes: {
    color: {
      control: {
        type: 'select',
      },
      options: ['neutral', 'primary', 'cyan', 'crimson', 'yellow'],
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
    fullWidth: {
      control: {
        type: 'boolean',
      },
    },
    justify: {
      control: {
        type: 'select',
      },
      options: ['center', 'space-between'],
    },
    leftSection: icon,
    loading: {
      control: {
        type: 'boolean',
      },
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
      options: ['default', 'filled', 'light', 'outline', 'subtle', 'transparent', 'white'],
    },
  },
} satisfies StoryDefault;
