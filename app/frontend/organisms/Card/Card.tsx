import React, { ElementType, forwardRef } from 'react';
import clsx from 'clsx';

import { CardComponent } from './Card.types';

import './Card.css';

export const Card: CardComponent = forwardRef(({ as, className, children, ...props }, ref) => {
  const Component = (as || 'article') as ElementType;

  return (
    <Component ref={ref} className={clsx('card', className)} {...props}>
      {children}
    </Component>
  );
});

Card.displayName = 'Card';

export default Card;
