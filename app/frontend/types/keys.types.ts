export type NoneOf<T> = {
  [K in keyof T]?: never;
};

export type ExactlyOneOf<T> = {
  [K in keyof T]: Required<Omit<NoneOf<T>, K> & { [P in K]: T[P] }>;
}[keyof T];

export type GetKeys<U> = U extends Record<infer K, infer _> ? K : never;

export type UnionToIntersection<U extends object> = {
  [K in GetKeys<U>]: U extends Record<K, infer T> ? T : never;
};
