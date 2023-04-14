import React, { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';

import BreadcrumbProvider from './BreadcrumbProvider';
import Breadcrumbs from './Breadcrumbs';
import { Crumb } from './Breadcrumbs.types';

type Story = StoryObj<typeof Breadcrumbs>;

const BreadcrumbsDemo: React.FC<PropsWithChildren<{ crumbs: Crumb[] }>> = ({
  crumbs,
  children,
}) => {
  if (!crumbs.length) {
    return <>{children}</>;
  } else {
    const [crumb, ...rest] = crumbs;

    return (
      <BreadcrumbProvider {...crumb}>
        <BreadcrumbsDemo crumbs={rest}>{children}</BreadcrumbsDemo>
      </BreadcrumbProvider>
    );
  }
};

export default {
  title: 'Molecules/Breadcrumbs',
  component: Breadcrumbs,
  argTypes: {},
  args: {
    text: 'Breadcrumbs',
  },
  render: (args) => (
    <BrowserRouter>
      <BreadcrumbsDemo
        crumbs={[
          { label: 'Admin', path: 'admin' },
          { label: 'Users', path: 'users' },
        ]}
      >
        <Breadcrumbs {...args} />
      </BreadcrumbsDemo>
    </BrowserRouter>
  ),
} satisfies Meta<typeof Breadcrumbs>;

export const Default: Story = {
  args: {
    //
  },
};
