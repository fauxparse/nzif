import * as ToastPrimitive from '@radix-ui/react-toast';
import { uniqueId } from 'lodash-es';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { Root } from './Root';
import classes from './Toast.module.css';
import { ToastHandle, ToastProps } from './types';

type ToastContext = {
  notify: (props: ToastProps) => ToastHandle;
};

const ToastContext = createContext<ToastContext>({
  notify: () => {
    throw new Error('notify() must be called from within a Toast.Provider');
  },
});

export const Provider: React.FC<PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastHandle[]>([]);

  const notify = useCallback((props: ToastProps) => {
    const id = uniqueId('toast:');
    const close = () => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };
    const handle: ToastHandle = { ...props, id, close };
    setToasts((prev) => [...prev, handle]);
    return handle;
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastPrimitive.Provider>
      <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
      {toasts.map((toast) => (
        <Root key={toast.id} {...toast} />
      ))}
      <ToastPrimitive.Viewport className={classes.viewport} />
    </ToastPrimitive.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
