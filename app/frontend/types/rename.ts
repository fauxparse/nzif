export type Rename<T, Old extends keyof T, New extends string | symbol> = {
  [K in keyof T as K extends Old ? New : K]: T[K];
};
