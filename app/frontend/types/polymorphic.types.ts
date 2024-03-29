// based on https://blog.logrocket.com/build-strongly-typed-polymorphic-components-react-typescript/

import { ComponentPropsWithRef, ComponentPropsWithoutRef, ElementType } from 'react';

export type As<C extends ElementType> = {
  /** HTML element or React component to render as */
  as?: C | undefined;
};

export type PolymorphicProps<C extends ElementType, Props = Record<string, never>> = Props &
  As<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof (As<C> & Props)>;

export type Polymorphic<C extends ElementType, Props = Record<string, never>> = PolymorphicProps<
  C,
  Props
> & {
  /** Ref to the base element */
  ref?: PolymorphicRef<C>;
};

export type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>['ref'];

export type WithDisplayName<T> = T & { displayName?: string };
