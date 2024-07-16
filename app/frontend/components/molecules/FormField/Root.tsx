import { Flex, FlexProps, TextField, Theme, ThemeProps } from '@radix-ui/themes';
import { ValidationError } from '@tanstack/react-form';
import clsx from 'clsx';
import { uniqueId } from 'lodash-es';
import { ReactNode, useMemo } from 'react';
import { FormFieldContext } from './Context';
import { Description } from './Description';
import { ErrorMessage } from './Error';

import classes from './FormField.module.css';
import { Label } from './Label';

type RootProps = FlexProps &
  Pick<TextField.RootProps, 'id' | 'size' | 'variant'> & {
    color?: ThemeProps['accentColor'];
    label?: ReactNode;
    error?: string | ValidationError | null;
    description?: string | null;
  };

export const Root: React.FC<RootProps> = ({
  className,
  id,
  size = '3',
  variant,
  color,
  label = null,
  error = null,
  description = null,
  children,
  ...props
}) => {
  const ownId = useMemo(() => uniqueId('formField_'), []);

  const errorMessage = error?.toString() || null;

  return (
    <FormFieldContext.Provider
      value={{ id: id || ownId, size, variant, error: errorMessage || null }}
    >
      <Theme asChild accentColor={error ? 'red' : color}>
        <Flex
          direction="column"
          gap="1"
          className={clsx(classes.root, 'form-field', className)}
          {...props}
          data-size={size}
          data-has-error={!!error || undefined}
        >
          {label && <Label>{label}</Label>}
          {children}
          {description && <Description>{description}</Description>}
          {error && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </Flex>
      </Theme>
    </FormFieldContext.Provider>
  );
};
