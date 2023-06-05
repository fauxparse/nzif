import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Button from '@/atoms/Button';

import Card from '.';

type Story = StoryObj<typeof Card>;

export default {
  title: 'Organisms/Card',
  component: Card,
  argTypes: {},
  args: {
    text: 'Card',
  },
  parameters: {
    layout: 'centered',
  },
  render: (args) => <Card {...args} />,
} satisfies Meta<typeof Card>;

export const Default: Story = {
  args: {
    children: (
      <>
        <div className="card__image">
          <img src="https://picsum.photos/seed/rWWCwZ/640/360" aria-hidden />
        </div>
        <Card.Details>
          <Card.Title className="workshop__name">Card title</Card.Title>
          <p>
            The Sprawl was a square of faint light. They floated in the shade beneath a bridge or
            overpass.
          </p>
        </Card.Details>
        <div className="card__footer">
          <Button small text="More info" />
          <Button small primary text="First choice" />
        </div>
      </>
    ),
  },
};
