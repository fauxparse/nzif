import type { StoryDefault } from '@ladle/react';
import { Skeleton } from '@radix-ui/themes';
import { Checkbox, CheckboxProps } from '.';

const CheckboxStory = (props: CheckboxProps) => (
  <form>
    <Checkbox {...props} />
  </form>
);

const IndeterminateCheckboxStory = (props: CheckboxProps) => (
  <Checkbox {...props} checked="indeterminate" />
);

const SkeletonCheckboxStory = (props: CheckboxProps) => (
  <Skeleton>
    <Checkbox {...props} />
  </Skeleton>
);

export {
  CheckboxStory as Checkbox,
  IndeterminateCheckboxStory as Indeterminate,
  SkeletonCheckboxStory as Skeleton,
};

export default {
  title: 'Atoms/Checkbox',
  args: {
    variant: 'surface',
    disabled: false,
  },
  argTypes: {
    size: {
      options: ['1', '2', '3'],
      control: {
        type: 'select',
      },
    },
    variant: {
      options: ['surface', 'soft'],
      control: {
        type: 'select',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
  },
} satisfies StoryDefault;
