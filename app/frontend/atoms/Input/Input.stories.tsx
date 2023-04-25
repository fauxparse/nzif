import type { StoryObj } from '@storybook/react';

import { InputProps, InputSize } from './Input.types';
import Input from '.';

type Story = StoryObj<typeof Input>;

export default {
  title: 'Atoms/Input',
  component: Input,
  argTypes: {
    as: {
      table: {
        defaultValue: {
          summary: 'input',
        },
        category: 'Proton',
      },
      control: {
        disable: true,
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    theme: {
      table: {
        disable: true,
      },
    },
    ref: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    text: 'Input',
  },
  render: (args: InputProps) => <Input {...args} />,
};

export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Placeholder',
  },
};

export const Small: Story = {
  args: {
    ...Default.args,
    size: InputSize.SMALL,
  } as InputProps,
};

export const Large: Story = {
  args: {
    ...Default.args,
    size: InputSize.LARGE,
  } as InputProps,
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    ...Default.args,
    value: 'Read only',
    readOnly: true,
  },
};
