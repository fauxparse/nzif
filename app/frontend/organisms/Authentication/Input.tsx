import React, { ComponentPropsWithoutRef, forwardRef } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import { formItem } from './variants';

type InputProps = ComponentPropsWithoutRef<'input'> & {
  icon?: React.ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = 'text', name, id = name, required = true, placeholder, icon, ...props },
    ref
  ) => (
    <motion.div className="input-group" variants={formItem}>
      {icon}
      <input
        ref={ref}
        type={type}
        name={name}
        id={id}
        required={required || undefined}
        className={clsx('input', className)}
        placeholder={placeholder}
        aria-label={placeholder}
        {...props}
      />
    </motion.div>
  )
);

Input.displayName = 'Input';

export default Input;
