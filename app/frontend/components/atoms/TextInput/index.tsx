import React from 'react';
import {
  BoxProps,
  ElementProps,
  factory,
  Factory,
  StylesApiProps,
  useProps,
  InputBase,
  __BaseInputProps,
} from '@mantine/core';

import './TextInput.css';
import clsx from 'clsx';

export interface TextInputProps extends BoxProps, __BaseInputProps, ElementProps<'input', 'size'> {}

export type TextInputFactory = Factory<{
  props: TextInputProps;
  ref: HTMLInputElement;
}>;

const defaultProps: Partial<TextInputProps> = {};

const TextInput = factory<TextInputFactory>((_props, ref) => {
  const { className, ...props } = useProps('TextInput', defaultProps, _props);

  return (
    <InputBase
      component="input"
      className={clsx('text-input', className)}
      ref={ref}
      {...props}
      __staticSelector="TextInput"
    />
  );
});

export default TextInput;
