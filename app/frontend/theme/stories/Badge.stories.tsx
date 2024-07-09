import CloseIcon from '@/icons/CloseIcon';
import { color } from '@ladle/helpers/color';
import type { Story, StoryDefault } from '@ladle/react';
import { Badge, BadgeProps, IconButton } from '@radix-ui/themes';

type BadgeStoryProps = Pick<BadgeProps, 'size' | 'variant' | 'color' | 'radius'> & {
  close: boolean;
  label: string;
  icon: string;
};

const BadgeStory: Story<BadgeStoryProps> = ({ close, label, icon, size, ...props }) => (
  <Badge size={size} {...props}>
    {label}
    {close && (
      <IconButton variant="solid" size="1">
        <CloseIcon />
      </IconButton>
    )}
  </Badge>
);

export { BadgeStory as Badge };

export default {
  title: 'Atoms',
  args: {
    close: false,
    color: 'primary',
    label: 'Badge text',
    radius: 'full',
    size: 'md',
    variant: 'default',
  },
  argTypes: {
    close: {
      control: {
        type: 'boolean',
      },
    },
    color,
    radius: {
      control: {
        type: 'select',
      },
      options: ['none', 'small', 'medium', 'large', 'full'],
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['1', '2', '3'],
    },
    variant: {
      control: {
        type: 'select',
      },
      options: ['solid', 'soft', 'surface', 'outline'],
    },
  },
} satisfies StoryDefault;
