import { ComponentPropsWithRef, ElementType, forwardRef } from 'react';

type Empty = Record<string, never>;

type AsProp<C extends ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = Empty,
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

type PolymorphicRef<C extends React.ElementType> = ComponentPropsWithRef<C>['ref'];

export type PolymorphicComponentPropsWithRef<
  C extends React.ElementType,
  P extends object = Empty,
> = PolymorphicComponentProps<C, P> & { ref?: PolymorphicRef<C> };

const Box = forwardRef(
  <C extends React.ElementType = 'div', P extends object = Empty>(
    { as, ...props }: PolymorphicComponentPropsWithRef<C, P>,
    ref?: PolymorphicRef<C>
  ) => {
    const Element = as ?? 'div';
    return <Element ref={ref} {...props} />;
  }
);

export default Box;
