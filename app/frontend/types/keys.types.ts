/* eslint-disable @typescript-eslint/no-explicit-any */

export type NoneOf<T> = {
  [K in keyof T]?: never;
};

export type ExactlyOneOf<T> = {
  [K in keyof T]: Required<Omit<NoneOf<T>, K> & { [P in K]: T[P] }>;
}[keyof T];

export type GetKeys<U> = U extends Record<infer K, any> ? K : never;

export type UnionToIntersection<U extends object> = {
  [K in GetKeys<U>]: U extends Record<K, infer T> ? T : never;
};
