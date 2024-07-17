import * as ToastPrimitive from '@radix-ui/react-toast';
import { Provider, useToast } from './Provider';
import { Root } from './Root';

export const Toast = {
  Root,
  Title: ToastPrimitive.Title,
  Description: ToastPrimitive.Description,
  Action: ToastPrimitive.Action,
  Close: ToastPrimitive.Close,
  Provider,
};

export { useToast };
