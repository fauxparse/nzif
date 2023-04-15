import { createContext } from 'react';

import { Notification, NotificationOptions, ToastContent } from './Toaster.types';

export default createContext(
  {} as {
    notifications: Map<string, Notification>;
    notify: (content: ToastContent, options?: NotificationOptions) => () => void;
  }
);
