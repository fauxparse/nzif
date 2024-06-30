import { color } from '@ladle/helpers/color';
import { size } from '@ladle/helpers/size';
import type { Story, StoryDefault } from '@ladle/react';
import { Checkbox, CheckboxProps } from '@mantine/core';

type CheckboxStoryProps = CheckboxProps & {
  color: string;
};

const CheckboxStory: Story<CheckboxStoryProps> = ({ color, ...props }) => (
  <Checkbox data-color={color} {...props} />
);

export { CheckboxStory as Checkbox };

export default {
  title: 'Atoms',
  args: {
    color: 'primary',
    indeterminate: false,
    label: 'I have read the Code of Conduct',
    size: 'md',
  },
  argTypes: {
    color,
    size,
  },
} satisfies StoryDefault;
