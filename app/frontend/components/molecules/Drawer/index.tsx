import * as Dialog from '@radix-ui/react-dialog';
import { Theme, useThemeContext } from '@radix-ui/themes';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import React, { ComponentProps, createContext, useCallback } from 'react';

import clsx from 'clsx';
import classes from './Drawer.module.css';

type Origin = 'left' | 'right' | 'top' | 'bottom';

type ContentProps = React.ComponentPropsWithoutRef<typeof Dialog.Content> & {
  origin: Origin;
  size: string | number;
  visible?: boolean;
};

const axis: Record<Origin, 'x' | 'y'> = {
  left: 'x',
  right: 'x',
  top: 'y',
  bottom: 'y',
};

const variants: Variants = {
  initial: (origin: Origin) => ({
    [axis[origin]]: origin === 'right' || origin === 'bottom' ? '100%' : '-100%',
  }),
  animate: (origin: Origin) => ({
    [axis[origin]]: 0,
  }),
} as const;

type DrawerContextType = {
  close: () => void;
};

const DrawerContext = createContext<DrawerContextType>({ close: () => void 0 });

const Content = React.forwardRef<HTMLDivElement, ContentProps>(
  ({ className, origin, ...props }, ref) => {
    // Fallback valiation for size to a proper value in case of invalid input.
    // If the size is a string and not a number, in the styles, fallback is 100%.
    const sizeChecker = (size: ContentProps['size']) => {
      if (typeof size === 'string' && !size.includes('%')) {
        const parsedSize = parseInt(size, 10);
        return Number.isNaN(parsedSize) ? size : `${parsedSize}px`;
      }
      return size;
    };

    const { appearance } = useThemeContext();

    const clicked = (event: React.MouseEvent<HTMLDivElement>) => {
      const { tagName } = event.target as HTMLElement;
      if (tagName === 'A' || tagName === 'BUTTON') {
      }
    };

    return (
      <AnimatePresence custom={origin}>
        {props.visible && (
          <Dialog.Portal forceMount>
            <Theme appearance={appearance}>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={classes.overlay}
                />
              </Dialog.Overlay>
              <Dialog.Content
                asChild
                ref={ref}
                className={clsx(classes.content, className)}
                style={{
                  height:
                    origin === 'bottom' || origin === 'top' ? sizeChecker(props.size) : '100%',
                  width: origin === 'left' || origin === 'right' ? sizeChecker(props.size) : '100%',
                }}
                onClick={clicked}
                {...props}
              >
                <motion.div
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="initial"
                  transition={{ ease: [0.4, 0, 0.2, 1] }}
                  custom={origin}
                  data-origin={origin}
                >
                  {props.children}
                </motion.div>
              </Dialog.Content>
            </Theme>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    );
  }
);

const Root: React.FC<ComponentProps<typeof Dialog.Root>> = ({ children, ...props }) => {
  const close = useCallback(() => {
    props.onOpenChange?.(false);
  }, [props.onOpenChange]);

  return (
    <DrawerContext.Provider value={{ close }}>
      <Dialog.Root {...props}>{children}</Dialog.Root>
    </DrawerContext.Provider>
  );
};

const Close: React.FC<ComponentProps<typeof Dialog.Close>> = ({ children, ...props }) => {
  const { close } = useDrawer();

  return (
    <Dialog.Close {...props} onClick={close}>
      {children}
    </Dialog.Close>
  );
};

export const useDrawer = () => React.useContext(DrawerContext);

export const Drawer = {
  Root,
  Trigger: Dialog.Trigger,
  Title: Dialog.Title,
  Description: Dialog.Description,
  Close: Dialog.Close,
  Content,
};
