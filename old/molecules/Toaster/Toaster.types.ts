import { PropsWithChildren, ReactNode } from 'react';

export type ToastContent = string | ReactNode;

export type NotificationOptions = {
  timeout?: number | null;
  dismissable?: boolean;
};

export type Notification = {
  id: string;
  content: ToastContent;
  timeout: ReturnType<typeof setTimeout> | null;
  options: NotificationOptions;
};

export type ToasterProps = PropsWithChildren;
