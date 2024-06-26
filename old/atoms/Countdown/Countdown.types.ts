import { DateTime } from 'luxon';
import { ComponentProps } from 'react';

export type CountdownProps = ComponentProps<'div'> & {
  to: DateTime;
  title?: string;
};
