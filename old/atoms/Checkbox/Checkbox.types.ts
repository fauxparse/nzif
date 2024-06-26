import { RadioProps } from '../Radio';

export type CheckboxProps = RadioProps & {
  indeterminate?: boolean;
  preference?: number;
};
