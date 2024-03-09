export type Colorway = 'neutral' | 'primary' | 'magenta' | 'cyan' | 'yellow';

export interface ColorwayProps {
  color?: Colorway;
}

export type Size = 'small' | 'medium' | 'large';

export interface SizeProps {
  size?: Size;
}

export type VariantProps<T> = {
  variant?: T;
};
