import { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Switch from './Switch';
import { Orientation, SwitchProps } from './Switch.types';

type Story = StoryObj<typeof Switch>;

type HiddenProps<T extends string> = Record<T, { table: { disable: true } }>;

const hideProps = <T extends string>(props: T[]): HiddenProps<T> =>
  props.reduce(
    (acc, prop) => ({ ...acc, [prop]: { table: { disable: true } } }),
    {} as HiddenProps<T>
  );

export default {
  title: 'Atoms/Switch',
  component: Switch,
  argTypes: {
    ...hideProps(['as', 'horizontal', 'vertical']),
    disabled: {
      description: 'Whether the switch is disabled',
      control: 'boolean',
    },
    indeterminate: {
      description: 'Whether the switch is in an indeterminate state',
    },
    orientation: {
      description: 'The orientation of the switch',
      table: {
        type: {
          summary: 'Orientation',
        },
        defaultValue: {
          summary: 'Orientation.HORIZONTAL',
        },
      },
    },
  },
  render: (args: SwitchProps) => <Switch {...args} />,
} satisfies Meta<typeof Switch>;

export const Default: Story = {
  args: {
    orientation: Orientation.HORIZONTAL,
  },
};

export const Small: Story = {
  args: {
    ...Default.args,
    style: {
      '--switch-height': '1rem',
    } as CSSProperties,
  },
};

export const Large: Story = {
  args: {
    ...Default.args,
    style: {
      '--switch-height': '2.5rem',
      '--switch-track-padding': '0.25rem',
    } as CSSProperties,
  },
};

export const Long: Story = {
  args: {
    ...Default.args,
    style: {
      '--switch-track-length': '6rem',
    } as CSSProperties,
  },
};

export const RTL: Story = {
  args: {
    ...Default.args,
    dir: 'rtl',
  },
};

export const Vertical: Story = {
  args: {
    orientation: Orientation.VERTICAL,
  },
};

export const Indeterminate: Story = {
  args: {
    ...Default.args,
    indeterminate: true,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    ...Default.args,
    disabled: true,
    checked: true,
  },
};

export const Squareish: Story = {
  args: {
    ...Default.args,
    style: { '--switch-border-radius': '0.25rem' } as CSSProperties,
  },
};

export const Icon: Story = {
  args: {
    ...Default.args,
    style: {
      '--switch-icon': `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9.35419 21C10.0593 21.6224 10.9856 22 12 22C13.0145 22 13.9407 21.6224 14.6458 21M18 8C18 6.4087 17.3679 4.88258 16.2427 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.8826 2.63214 7.75738 3.75736C6.63216 4.88258 6.00002 6.4087 6.00002 8C6.00002 11.0902 5.22049 13.206 4.34968 14.6054C3.61515 15.7859 3.24788 16.3761 3.26134 16.5408C3.27626 16.7231 3.31488 16.7926 3.46179 16.9016C3.59448 17 4.19261 17 5.38887 17H18.6112C19.8074 17 20.4056 17 20.5382 16.9016C20.6852 16.7926 20.7238 16.7231 20.7387 16.5408C20.7522 16.3761 20.3849 15.7859 19.6504 14.6054C18.7795 13.206 18 11.0902 18 8Z' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A")`,
    } as CSSProperties,
  },
};
