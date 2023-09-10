export type SegmentedOption<T extends string = string> = {
  id: T;
  label: string | (<V extends SegmentedOption<T>>(option: V) => string);
};

type BaseSegmentedProps<T extends string = string> = {
  options: SegmentedOption<T>[];
  className?: string;
};

export type ExclusiveSegmentedProps<T extends string = string> = BaseSegmentedProps<T> & {
  exclusive: true;
  value: T;
  onChange: (value: T) => void;
};

export type MultipleSegmentedProps<T extends string = string> = BaseSegmentedProps<T> & {
  exclusive?: false;
  value: T[];
  onChange: (value: T[]) => void;
};

export type SegmentedProps<T extends string = string> =
  | ExclusiveSegmentedProps<T>
  | MultipleSegmentedProps<T>;

export const isExclusive = <T extends string = string>(
  props: SegmentedProps<T>
): props is ExclusiveSegmentedProps<T> => !!props.exclusive;
