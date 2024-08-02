import clsx from 'clsx';
import React from 'react';

import { MoneyProps } from './types';

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
