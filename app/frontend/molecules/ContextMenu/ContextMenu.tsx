import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react';

import Menu, { MenuProps } from '../Menu';

import { useContextMenu } from './Context';

import './ContextMenu.css';

export const ContextMenu: React.FC<MenuProps> = ({ id = 'default', className, children }) => {
  const { currentMenu, position, close } = useContextMenu();

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = currentMenu === id;
  const setIsOpen = (isOpen: boolean) => {
    if (!isOpen) close();
  };

  const listItemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const listContentRef = useRef(
    Children.map(children, (child) => (isValidElement(child) ? child.props.label : null)) as Array<
      string | null
    >
  );

  const { x, y, refs, strategy, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset({ mainAxis: 5, alignmentAxis: 4 }),
      flip({
        fallbackPlacements: ['left-start'],
      }),
      shift({ padding: 10 }),
    ],
    placement: 'right-start',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
  });

  const role = useRole(context, { role: 'menu' });
  const dismiss = useDismiss(context);
  const listNavigation = useListNavigation(context, {
    listRef: listItemsRef,
    onNavigate: setActiveIndex,
    activeIndex,
  });
  const typeahead = useTypeahead(context, {
    enabled: isOpen,
    listRef: listContentRef,
    onMatch: setActiveIndex,
    activeIndex,
  });

  const { getFloatingProps, getItemProps } = useInteractions([
    role,
    dismiss,
    listNavigation,
    typeahead,
  ]);

  useEffect(() => {
    refs.setPositionReference({
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x: position.x,
          y: position.y,
          top: position.y,
          right: position.x,
          bottom: position.y,
          left: position.x,
        };
      },
    });
  }, [position, refs]);

  return (
    <FloatingPortal>
      <AnimatePresence>
        {isOpen && (
          <FloatingOverlay lockScroll>
            <FloatingFocusManager context={context} initialFocus={refs.floating}>
              <Menu
                as={motion.div}
                className={clsx('context-menu', className)}
                ref={refs.setFloating}
                style={{
                  position: strategy,
                  left: x ?? 0,
                  top: y ?? 0,
                  transformOrigin: '0 0',
                }}
                {...getFloatingProps()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { type: 'spring', bounce: 0.5 },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  transition: { duration: 0.15, ease: 'anticipate' },
                }}
              >
                {Children.map(
                  children,
                  (child, index) =>
                    isValidElement(child) &&
                    cloneElement(
                      child,
                      getItemProps({
                        tabIndex: activeIndex === index ? 0 : -1,
                        ref(node: HTMLButtonElement) {
                          listItemsRef.current[index] = node;
                        },
                        onClick() {
                          child.props.onClick?.();
                          setIsOpen(false);
                        },
                      })
                    )
                )}
              </Menu>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </AnimatePresence>
    </FloatingPortal>
  );
};

export default ContextMenu;
