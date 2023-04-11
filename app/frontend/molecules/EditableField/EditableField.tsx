import React, { ElementType, forwardRef, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Input from '../../atoms/Input';

import { EditableFieldComponent } from './EditableField.types';

import './EditableField.css';

const errorMessageVariants = {
  out: {
    opacity: 0,
    x: 40,
  },
  in: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      bounce: 0.2,
      delay: 0.25,
    },
  },
};

export const EditableField: EditableFieldComponent = forwardRef(
  ({ as, id: passedId, label, name, required, errors, ...props }, ref) => {
    const Component = (as || 'input') as ElementType;

    const ownId = useId();

    const id = passedId || ownId;

    const ownErrors = errors?.[name] || [];

    return (
      <>
        <motion.label layout htmlFor={id} data-required={required || undefined}>
          {label}
        </motion.label>
        <Input
          as={Component}
          id={id}
          name={name}
          ref={ref}
          data-has-errors={ownErrors.length > 0 || undefined}
          required={required || undefined}
          {...props}
        />
        <AnimatePresence>
          {ownErrors.map((error) => (
            <motion.div
              key={error}
              className="error-message"
              variants={errorMessageVariants}
              initial="out"
              animate="in"
              exit="out"
            >
              {error}
            </motion.div>
          ))}
        </AnimatePresence>
      </>
    );
  }
);

EditableField.displayName = 'EditableField';

export default EditableField;
