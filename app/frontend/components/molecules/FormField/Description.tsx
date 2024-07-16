import { Text, TextProps } from '@radix-ui/themes';
import clsx from 'clsx';
import { useContext } from 'react';
import { FormFieldContext } from './Context';

import classes from './FormField.module.css';

export const Description: React.FC<TextProps> = ({ className, children, ...props }) => {
  const { size } = useContext(FormFieldContext);

  if (!children) return null;

  return (
    <Text className={clsx(classes.description, className)} size={size} {...props}>
      {children}
    </Text>
  );
};
