import React, { ElementType, forwardRef } from 'react';
import clsx from 'clsx';

import { MoneyProps } from './Money.types';

import './Money.css';

export const Money: React.FC<MoneyProps> = ({ cents, includeCurrency, className, ...props }) => {
  return (
    <span className={clsx('money', className)} {...props}>
      {(cents / 100).toLocaleString(navigator.language, {
        style: 'currency',
        currency: 'NZD',
        currencyDisplay: 'narrowSymbol',
        maximumFractionDigits: 0,
      })}
      {includeCurrency && (
        <abbr className="money__currency" title="New Zealand Dollars">
          NZD
        </abbr>
      )}
    </span>
  );
};

Money.displayName = 'Money';

export default Money;
