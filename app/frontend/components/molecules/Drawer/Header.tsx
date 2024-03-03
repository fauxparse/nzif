import {
  factory,
  Factory,
  useProps,
  ModalBaseHeaderProps,
  Box,
  DrawerCloseButton,
  DrawerTitle,
} from '@mantine/core';
import clsx from 'clsx';
import CloseIcon from '@/icons/CloseIcon';
import { ReactNode } from 'react';

export type DrawerHeaderProps = Omit<ModalBaseHeaderProps, 'title'> & {
  title?: ReactNode;
};

export type DrawerHeaderFactory = Factory<{
  props: DrawerHeaderProps;
  ref: HTMLElement;
  compound: true;
}>;

const defaultProps: Partial<DrawerHeaderProps> = {};

export const DrawerHeader = factory<DrawerHeaderFactory>((_props, ref) => {
  const { className, title, ...props } = useProps('DrawerHeader', defaultProps, _props);

  return (
    <Box component="header" className={clsx('drawer__header', className)} ref={ref} {...props}>
      {title && <DrawerTitle className="drawer__title">{title}</DrawerTitle>}
      <DrawerCloseButton
        icon={<CloseIcon />}
        className="button button--close"
        data-size="medium"
        data-variant="close"
      />
    </Box>
  );
});

DrawerHeader.displayName = 'Drawer.Header';

export default DrawerHeader;
