export type Colorway = 'neutral' | 'primary' | 'magenta' | 'cyan' | 'yellow';

export type ColorwayProps = {
  color?: Colorway;
};

export type Size = 'small' | 'medium' | 'large';

export type SizeProps = {
  size?: Size;
};

export type VariantProps<T> = {
  variant?: T;
};
