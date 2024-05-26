import {
  Checkbox,
  Input,
  Modal,
  Pill,
  PillGroup,
  PillsInput,
  PillsInputField,
  Select,
  Text,
  createTheme,
  rem,
} from '@mantine/core';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import Button from './components/Button';

import { CheckboxIcon } from '@/icons/CheckboxIcon';
import CloseIcon from '@/icons/CloseIcon';
import './theme.css';

export const theme = createTheme({
  fontFamily: '"DIN Round Pro", sans-serif',
  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(20),
    xl: rem(24),
  },
  lineHeights: {
    xs: rem(16),
    sm: rem(24),
    md: rem(24),
    lg: rem(24),
    xl: rem(40),
  },
  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(12),
    lg: rem(24),
    xl: rem(32),
    base: rem(16),
  },
  components: {
    Button,
    Checkbox: Checkbox.extend({
      defaultProps: {
        icon: CheckboxIcon,
      },
      vars: () => ({
        root: {
          '--checkbox-color': 'var(--background-selected)',
        },
      }),
    }),
    DatePickerInput: DatePickerInput.extend({
      defaultProps: {
        size: 'md',
      },
    }),
    Input: Input.extend({
      defaultProps: {
        size: 'md',
      },
      styles: {
        wrapper: {
          '--input-bd': 'var(--border-input)',
          '--input-bd-hover': 'var(--border-input-hover)',
          '--input-bd-focus': 'var(--border-input-focus)',
          '--input-height-md': rem(40),
          '--input-padding': 'calc(var(--spacing-medium) - 1px)',
        },
      },
    }),
    Modal: Modal.extend({
      defaultProps: {
        closeButtonProps: {
          icon: <CloseIcon />,
        },
      },
      styles: {
        content: {
          borderRadius: 'var(--radius-medium)',
        },
      },
    }),
    Pill: Pill.extend({
      defaultProps: {
        size: 'md',
      },
      styles: {
        root: {
          '--pill-height-md': rem(32),
          '--pill-fz-md': 'var(--font-size-md)',
          borderRadius: 'var(--radius-small)',
          backgroundColor: 'var(--background-light)',
        },
      },
    }),
    PillGroup: PillGroup.extend({
      vars: () => ({
        group: {
          '--pg-gap': 'var(--spacing-tiny)',
        },
      }),
    }),
    PillsInput: PillsInput.extend({
      vars: () => ({
        wrapper: {
          '--input-padding': rem(3),
        },
        input: {
          '--input-padding-y': rem(3),
        },
      }),
    }),
    PillsInputField: PillsInputField.extend({
      styles: {
        field: {
          height: rem(32),
        },
      },
    }),
    SegmentedControl: {
      defaultProps: {
        size: 'md',
      },
      styles: {
        root: {
          backgroundColor: 'var(--background-light)',
        },
        control: {
          '--separator-color': 'var(--border-subtle)',
        },
        indicator: {},
      },
    },
    Select: Select.extend({
      defaultProps: {
        size: 'md',
        withCheckIcon: false,
      },
    }),
    Text: Text.extend({
      defaultProps: {
        size: 'md',
      },
    }),
    TimeInput: TimeInput.extend({
      defaultProps: {
        size: 'md',
      },
    }),
  },
});
