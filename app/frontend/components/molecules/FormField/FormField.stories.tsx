import { StoryDefault } from '@ladle/react';
import { TextField } from '@radix-ui/themes';
import React from 'react';
import { FormField } from '.';

type Args = Pick<TextField.RootProps, 'size' | 'variant'>;

export const Default: React.FC<Args> = ({ size, variant }) => (
  <FormField.Root size={size} variant={variant}>
    <FormField.Label>Search</FormField.Label>
    <FormField.TextField />
  </FormField.Root>
);

export const Responsive: React.FC<Args> = ({ size, variant }) => (
  <FormField.Root size={{ initial: '1', sm: '2', md: '3' }} variant={variant}>
    <FormField.Label>Search</FormField.Label>
    <FormField.TextField />
  </FormField.Root>
);

export const Colored: React.FC<Args> = ({ size, variant }) => (
  <FormField.Root color="cyan" size={size} variant={variant}>
    <FormField.Label>Search</FormField.Label>
    <FormField.TextField />
  </FormField.Root>
);

export default {
  title: 'Molecules/FormField',
  args: {
    size: '3',
    variant: 'surface',
  },
  argTypes: {
    size: {
      options: ['1', '2', '3'],
      control: {
        type: 'select',
      },
    },
    variant: {
      options: ['classic', 'soft', 'surface'],
      control: {
        type: 'select',
      },
    },
  },
} satisfies StoryDefault;
