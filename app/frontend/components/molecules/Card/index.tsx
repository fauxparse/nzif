import { forwardRef, PropsWithChildren } from 'react';
import { Box, BoxProps, createPolymorphicComponent } from '@mantine/core';
import clsx from 'clsx';
import { Link, ToOptions } from '@tanstack/react-router';

import './Card.css';

export type CardProps = PropsWithChildren<BoxProps> &
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  (({ component: typeof Link } & ToOptions) | { component?: any });

const Card = createPolymorphicComponent<'article', CardProps>(
  forwardRef<HTMLButtonElement, CardProps>(({ className, children, ...props }, ref) => (
    <Box component="button" className={clsx('card', className)} {...props} ref={ref}>
      {children}
    </Box>
  ))
);

export default Card;
