import { Button, Group, Modal, ModalProps } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import clsx from 'clsx';
import { PropsWithChildren, createContext, useCallback, useContext, useState } from 'react';

import './ConfirmationModal.css';
import { CountdownButton } from './CountdownButton';

type ConfirmOptions = Omit<ConfirmationModalProps, 'opened' | 'onClose' | 'onConfirm' | 'onCancel'>;

type ConfirmationModalContextType = {
  confirm: (options: ConfirmOptions) => Promise<void>;
};

type ConfirmationModalProps = ModalProps & {
  confirm?: string;
  cancel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  className,
  children,
  confirm = 'OK',
  cancel = 'Cancel',
  onConfirm,
  onCancel,
  ...props
}) => (
  <Modal className={clsx('confirmation-modal', className)} centered zIndex={1000} {...props}>
    {children}

    <Group className="confirmation-modal__buttons">
      <Button type="button" onClick={onCancel}>
        {cancel}
      </Button>
      <CountdownButton type="button" variant="filled" onClick={onConfirm}>
        {confirm}
      </CountdownButton>
    </Group>
  </Modal>
);

const ConfirmationModalContext = createContext<ConfirmationModalContextType>({
  confirm: () => Promise.resolve(),
});

export const ConfirmationModalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [opened, { open, close }] = useDisclosure();

  const [modalProps, setModalProps] = useState<Partial<ConfirmationModalProps>>({});

  const [[resolve, reject], setPromise] = useState<[() => void, () => void]>([() => {}, () => {}]);

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<void>((resolve, reject) => {
        setModalProps(options);
        setPromise([resolve, reject]);
        open();
      }).finally(close),
    []
  );

  return (
    <ConfirmationModalContext.Provider value={{ confirm }}>
      {children}
      <ConfirmationModal
        withCloseButton={false}
        {...modalProps}
        opened={opened}
        onClose={close}
        onConfirm={resolve}
        onCancel={reject}
      />
    </ConfirmationModalContext.Provider>
  );
};

export const useConfirmation = () => useContext(ConfirmationModalContext);
