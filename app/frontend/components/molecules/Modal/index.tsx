import { Modal as MantineModal, ModalProps as MantineModalProps } from '@mantine/core';
import { forwardRef } from 'react';
import './Modal.css';

export type ModalProps = MantineModalProps;

export const Modal = forwardRef<HTMLDivElement, ModalProps>(({ children, ...props }, ref) => {
  return (
    <MantineModal ref={ref} transitionProps={{ transition: 'slide-down' }} {...props}>
      {children}
    </MantineModal>
  );
});
