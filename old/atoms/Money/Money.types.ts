import { ComponentProps } from 'react';

export type MoneyProps = ComponentProps<'span'> & {
  cents: number;
  includeCurrency?: boolean;
};
