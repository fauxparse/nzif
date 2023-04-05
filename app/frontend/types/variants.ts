/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */

import { get, omit } from 'lodash-es';

import { ExactlyOneOf } from './keys.types';
import { Empty, Expand } from './utility.types';

export type VariantProp<K, T> = K extends string
  ? T extends string
    ? Expand<
        | ({ [key in K]?: T } & { [key in T]?: never })
        | ({ [key in K]?: never } & ExactlyOneOf<{ [key in T]: true }>)
      >
    : never
  : never;

export type VariantProps<T> = Empty<T> extends true
  ? {}
  : { [key in keyof T]: VariantProp<key, T[key]> & VariantProps<Omit<T, key>> }[keyof T];

type VariantPropTypes<T> = {
  [K in keyof T]: T[K] extends { values: infer E } ? E[keyof E] : never;
};

type Variant<T> = T extends { values: infer E; defaultValue: infer D }
  ? D extends E[keyof E]
    ? T
    : never
  : never;

type VariantConfig<T> = { [K in keyof T]: Variant<T[K]> };

export type PropsWithVariants<T> = VariantProps<VariantPropTypes<T>>;

export const extractVariants = <T, P extends PropsWithVariants<T>>(
  variants: VariantConfig<T>,
  props: P
): P => {
  const keys = Object.keys(variants) as (keyof T)[];
  const allProps = keys.flatMap((key) => Object.values(variants[key]['values']));
  const propsWithVariants = keys.reduce(
    (acc, key) => ({
      ...acc,
      [key]:
        get(props, key) ||
        (Object.values(variants[key]['values']) as (keyof P)[]).find((v) => !!props[v]) ||
        variants[key]['defaultValue'],
    }),
    props
  );
  return omit(propsWithVariants, allProps as (keyof typeof propsWithVariants)[]) as P;
};
