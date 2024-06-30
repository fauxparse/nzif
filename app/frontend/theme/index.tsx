import CheckboxIcon from '@/icons/CheckboxIcon';
import CloseIcon from '@/icons/CloseIcon';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Checkbox,
  CloseButton,
  Input,
  Kbd,
  Modal,
  Overlay,
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

import './theme.css';

import badgeClasses from './components/Badge.module.css';
import buttonClasses from './components/Button.module.css';
import cardClasses from './components/Card.module.css';
import checkboxClasses from './components/Checkbox.module.css';
import inputClasses from './components/Input.module.css';
import kbdClasses from './components/Kbd.module.css';
import modalClasses from './components/Modal.module.css';

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
    ActionIcon: ActionIcon.extend({
      classNames: buttonClasses,
      defaultProps: {
        size: 'md',
        variant: 'transparent',
        'data-color': 'neutral',
      },
      vars: () => ({
        root: {
          '--ai-bg': 'var(--button-background)',
          '--ai-hover': 'var(--button-background-hover)',
          '--ai-color': 'var(--button-text)',
          '--ai-hover-color': 'var(--button-text)',
          '--ai-bd': 'var(--button-border-width) solid var(--button-border-color)',
          '--ai-radius': 'var(--radius-round)',
        },
        icon: {
          '--icon': 'currentColor',
        },
      }),
    }),
    Badge: Badge.extend({
      classNames: badgeClasses,
      defaultProps: {
        size: 'md',
        radius: 'xl',
        'data-color': 'primary',
      },
      vars: () => ({
        root: {
          '--badge-bg': 'var(--badge-background)',
          '--badge-bd': 'var(--badge-border-width) solid var(--badge-border-color)',
          '--badge-color': 'var(--badge-text)',
          '--badge-dot-color': 'var(--background-solid)',
        },
      }),
    }),
    Button: Button.extend({
      classNames: buttonClasses,
      defaultProps: {
        size: 'md',
        'data-color': 'neutral',
      },
      vars: () => ({
        root: {
          '--button-bd': 'var(--button-border-width) solid var(--button-border-color)',
          '--button-bg': 'var(--button-background)',
          '--button-hover': 'var(--button-background-hover)',
          '--button-color': 'var(--button-text)',
        },
      }),
    }),
    Card: Card.extend({
      classNames: cardClasses,
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
        withBorder: true,
      },
    }),
    Checkbox: Checkbox.extend({
      classNames: checkboxClasses,
      defaultProps: {
        icon: CheckboxIcon,
        size: 'md',
      },
      vars: () => ({
        root: {
          '--checkbox-color': 'var(--background-selected)',
        },
      }),
    }),
    CloseButton: CloseButton.extend({
      classNames: buttonClasses,
      defaultProps: {
        radius: 'round',
        variant: 'transparent',
        icon: <CloseIcon />,
      },
    }),
    DatePickerInput: DatePickerInput.extend({
      defaultProps: {
        size: 'md',
      },
    }),
    Input: Input.extend({
      classNames: inputClasses,
      defaultProps: {
        size: 'md',
      },
      styles: {
        wrapper: {
          '--input-bd': 'var(--border-input)',
          '--input-bd-hover': 'var(--border-input-hover)',
          '--input-bd-focus': 'var(--border-input-focus)',
          '--input-padding': 'calc(var(--spacing-medium) - 1px)',
        },
      },
    }),
    Kbd: Kbd.extend({
      classNames: kbdClasses,
    }),
    Modal: Modal.extend({
      classNames: modalClasses,
      defaultProps: {
        radius: 'md',
      },
    }),
    Overlay: Overlay.extend({
      defaultProps: {
        color: 'var(--scrim)',
        backgroundOpacity: 1,
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
