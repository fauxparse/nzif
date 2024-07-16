import { Text, TextProps } from '@radix-ui/themes';
import clsx from 'clsx';
import { useContext } from 'react';
import { FormFieldContext } from './Context';

import classes from './FormField.module.css';

type LabelProps = TextProps & Pick<React.LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'>;

export const Label: React.FC<LabelProps> = ({ className, htmlFor, children, ...props }) => {
  const { id, size } = useContext(FormFieldContext);

  return (
    <Text className={clsx(classes.label, className)} size={size} weight="medium" asChild {...props}>
      <label htmlFor={htmlFor ?? id}>{children}</label>
    </Text>
  );
};
