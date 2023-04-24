import { ProtonProps } from '@/components/Proton';

export type UnwantedInputProps =
  | 'accept'
  | 'alt'
  | 'capture'
  | 'dirname'
  | 'formaction'
  | 'formenctype'
  | 'formmethod'
  | 'formnovalidate'
  | 'formtarget'
  | 'height'
  | 'list'
  | 'max'
  | 'maxlength'
  | 'min'
  | 'minlength'
  | 'multiple'
  | 'pattern'
  | 'placeholder'
  | 'readonly'
  | 'size'
  | 'src'
  | 'step'
  | 'width';

export type RadioProps = Omit<ProtonProps<'input'>, UnwantedInputProps>;
