import React, { useEffect, useReducer, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { merge, uniqueId } from 'lodash-es';

import Context from './Context';
import Toast from './Toast';
import { Notification, NotificationOptions, ToastContent, ToasterProps } from './Toaster.types';

import './Toaster.css';

type Action =
  | { type: 'ADD'; id: string; content: ToastContent; options: NotificationOptions }
  | { type: 'REMOVE'; id: string };

const TIMEOUT = 5000;

const DEFAULT_OPTIONS: NotificationOptions = {
  timeout: 5000,
  dismissable: true,
};

export const Toaster: React.FC<ToasterProps> = ({ children }) => {
  const timeouts = useRef<Notification['timeout'][]>([]);

  const [notifications, dispatch] = useReducer(
    (current: Map<string, Notification>, action: Action) => {
      switch (action.type) {
        case 'ADD':
          return new Map(current).set(action.id, {
            id: action.id,
            content: action.content,
            timeout:
              (action.options.timeout &&
                setTimeout(() => {
                  dispatch({ type: 'REMOVE', id: action.id });
                }, TIMEOUT)) ||
              null,
            options: action.options,
          });
        case 'REMOVE': {
          const map = new Map(current);
          map.delete(action.id);
          return map;
        }
      }
    },
    new Map()
  );

  const notify = (content: ToastContent, options: NotificationOptions = {}) => {
    const id = uniqueId('toast_');
    dispatch({ type: 'ADD', id, content, options: merge({}, DEFAULT_OPTIONS, options) });
    return () => dismiss(id);
  };

  const dismiss = (id: string) => {
    dispatch({ type: 'REMOVE', id });
  };

  useEffect(() => {
    timeouts.current = [...notifications.values()]
      .map((notification) => notification.timeout)
      .filter(Boolean);
  }, [notifications]);

  useEffect(
    () => () =>
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timeouts.current.forEach((timeout) => {
        if (timeout) {
          clearTimeout(timeout);
        }
      }),
    []
  );

  return (
    <>
      <Context.Provider value={{ notifications, notify }}>{children}</Context.Provider>
      <motion.div className="toaster" aria-live="polite" role="region">
        <AnimatePresence initial={false}>
          {[...notifications.values()].reverse().map((notification) => (
            <Toast
              key={notification.id}
              {...notification}
              onDismiss={() => dismiss(notification.id)}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Toaster;
