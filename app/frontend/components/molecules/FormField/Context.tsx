import { TextField } from '@radix-ui/themes';
import { createContext } from 'react';

type FormFieldContext = Pick<TextField.RootProps, 'id' | 'size' | 'variant'> & {
  error?: string | null;
};

export const FormFieldContext = createContext<FormFieldContext>({});
