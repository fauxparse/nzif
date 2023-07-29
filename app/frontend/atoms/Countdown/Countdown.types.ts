import { ComponentProps } from 'react';
import { DateTime } from 'luxon';

export type CountdownProps = ComponentProps<'div'> & {
  to: DateTime;
  title?: string;
};
