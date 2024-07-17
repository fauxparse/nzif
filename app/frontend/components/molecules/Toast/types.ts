import { ReactNode } from 'react';

export type ToastProps = {
  title?: ReactNode;
  description: ReactNode;
  action?: ReactNode;
};

export type ToastHandle = ToastProps & {
  id: string;
  close: () => void;
};
