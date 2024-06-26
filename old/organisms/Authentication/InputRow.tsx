import { motion } from 'framer-motion';
import React, { forwardRef } from 'react';

import { IconName } from '@/atoms/Icon/icons';
import Input, { InputProps } from '@/atoms/Input';
import InputGroup from '@/molecules/InputGroup';

import { formItem } from './variants';

type InputRowProps = InputProps & {
  icon?: IconName;
};

const InputRow = forwardRef<HTMLInputElement, InputRowProps>(
  ({ type = 'text', name, id = name, required = true, placeholder, icon, ...props }, ref) => (
    <InputGroup as={motion.div} variants={formItem}>
      <InputGroup.Icon name={icon} />
      <Input
        ref={ref}
        type={type}
        name={name}
        id={id}
        required={required || undefined}
        placeholder={placeholder}
        aria-label={placeholder}
        {...props}
      />
    </InputGroup>
  )
);

InputRow.displayName = 'Input';

export default InputRow;
