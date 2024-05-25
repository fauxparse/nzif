import {
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  DrawerRoot,
  DrawerRootProps,
  DrawerTitle,
  Factory,
  ModalBaseCloseButtonProps,
  ModalBaseOverlayProps,
  factory,
  getDefaultZIndex,
  useProps,
} from '@mantine/core';
import React from 'react';
import DrawerContext from './Context';
import './Drawer.css';
import DrawerHeader from './Header';

export interface DrawerProps extends DrawerRootProps {
  /** Drawer title */
  title?: React.ReactNode;

  /** Determines whether the overlay should be rendered, `true` by default */
  withOverlay?: boolean;

  /** Props passed down to the `Overlay` component, can be used to configure opacity, `background-color`, styles and other properties */
  overlayProps?: ModalBaseOverlayProps;

  /** Drawer content */
  children?: React.ReactNode;

  /** Determines whether the close button should be rendered, `true` by default */
  withCloseButton?: boolean;

  /** Props passed down to the close button */
  closeButtonProps?: ModalBaseCloseButtonProps;
}

export type DrawerFactory = Factory<{
  props: DrawerProps;
  ref: HTMLDivElement;
  staticComponents: {
    Root: typeof DrawerRoot;
    Overlay: typeof DrawerOverlay;
    Content: typeof DrawerContent;
    Body: typeof DrawerBody;
    Header: typeof DrawerHeader;
    Title: typeof DrawerTitle;
    CloseButton: typeof DrawerCloseButton;
  };
}>;

const defaultProps: Partial<DrawerProps> = {
  closeOnClickOutside: true,
  withinPortal: true,
  lockScroll: true,
  trapFocus: true,
  returnFocus: true,
  closeOnEscape: true,
  keepMounted: false,
  zIndex: getDefaultZIndex('modal'),
  withOverlay: true,
  withCloseButton: true,
};

export const Drawer = factory<DrawerFactory>((_props, ref) => {
  const {
    title,
    withOverlay,
    overlayProps,
    withCloseButton,
    closeButtonProps,
    children,
    onClose,
    ...others
  } = useProps('Drawer', defaultProps, _props);

  const hasHeader = !!title || withCloseButton;

  return (
    <DrawerContext.Provider value={{ close: () => onClose() }}>
      <DrawerRoot ref={ref} onClose={onClose} {...others}>
        {withOverlay && <DrawerOverlay {...overlayProps} />}
        <DrawerContent>
          {hasHeader && (
            <DrawerHeader title={title}>
              {title && <DrawerTitle className="drawer__title">{title}</DrawerTitle>}
              {withCloseButton && <DrawerCloseButton {...closeButtonProps} />}
            </DrawerHeader>
          )}

          <DrawerBody className="drawer__body">{children}</DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    </DrawerContext.Provider>
  );
});

Drawer.displayName = 'Drawer';
Drawer.Root = DrawerRoot;
Drawer.Overlay = DrawerOverlay;
Drawer.Content = DrawerContent;
Drawer.Body = DrawerBody;
Drawer.Header = DrawerHeader;
Drawer.Title = DrawerTitle;
Drawer.CloseButton = DrawerCloseButton;

export default Drawer;
