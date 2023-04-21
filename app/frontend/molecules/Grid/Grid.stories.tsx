import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { motion } from 'framer-motion';
import { DateTime } from 'luxon';

import { Grid } from './Grid';
import { CellProps, ColumnHeaderProps, RowHeaderProps } from './Grid.types';

type Story = StoryObj<typeof Grid>;

export default {
  title: 'Molecules/Grid',
  component: Grid,
  argTypes: {},
  args: {
    text: 'Grid',
  },
  render: (args) => <Grid {...args} />,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Grid>;

const startDate = DateTime.local(2023, 10, 7);

const ColumnHeader: React.FC<ColumnHeaderProps> = ({ column, ...props }) => (
  <motion.div {...props}>
    {startDate
      .set({ hour: Math.floor(column / 2) + 9, minute: (column % 2) * 30 })
      .toFormat('h:mm')}
  </motion.div>
);

const RowHeader: React.FC<RowHeaderProps> = ({ row, ...props }) => (
  <motion.div {...props}>{startDate.plus({ days: row }).toFormat('ccc d MMM')}</motion.div>
);

const Cell: React.FC<CellProps> = ({ row, column, ...props }) => (
  <motion.div {...props}>{`${column}, ${row}`}</motion.div>
);

export const DateGrid: Story = {
  args: {
    rows: 8,
    columns: 30,
    cell: Cell,
    columnHeader: ColumnHeader,
    rowHeader: RowHeader,
  },
};
