import { createContext } from 'react';

import { Notification, NotificationOptions, ToastContent } from './Toaster.types';

export default createContext({
  notify: () => () => void 0,
  notifications: new Map<string, Notification>(),
} as {
  notifications: Map<string, Notification>;
  notify: (content: ToastContent, options?: NotificationOptions) => () => void;
});
