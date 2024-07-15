import { AlertDialog, Button, Flex } from '@radix-ui/themes';
import { PropsWithChildren, createContext, useCallback, useContext, useState } from 'react';
import { CountdownButton } from './CountdownButton';

import classes from './ConfirmationModal.module.css';

type ConfirmOptions = Omit<
  ConfirmationModalProps,
  'open' | 'onOpenChange' | 'onConfirm' | 'onCancel'
>;

type ConfirmationModalContextType = {
  confirm: (options: ConfirmOptions) => Promise<void>;
};

type ConfirmationModalProps = AlertDialog.RootProps & {
  className?: string;
  title?: string;
  confirm?: string;
  cancel?: string;
  countdown?: number;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  className,
  children,
  title,
  confirm = 'OK',
  cancel = 'Cancel',
  countdown = 3,
  onConfirm,
  onCancel,
  ...props
}) => (
  <AlertDialog.Root {...props}>
    <AlertDialog.Content className={classes.content} maxWidth="30rem">
      {title && <AlertDialog.Title>{title}</AlertDialog.Title>}
      <AlertDialog.Description>{children}</AlertDialog.Description>
      <Flex className={classes.buttons} gap="3" mt="4" justify="end">
        <AlertDialog.Cancel>
          <Button variant="outline" size="3" color="gray">
            {cancel}
          </Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action>
          <CountdownButton variant="solid" size="3" seconds={countdown} onClick={onConfirm}>
            {confirm}
          </CountdownButton>
        </AlertDialog.Action>
      </Flex>
    </AlertDialog.Content>
  </AlertDialog.Root>
);

const ConfirmationModalContext = createContext<ConfirmationModalContextType>({
  confirm: () => Promise.resolve(),
});

export const ConfirmationModalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const [modalProps, setModalProps] = useState<Partial<ConfirmationModalProps>>({});

  const [[resolve, reject], setPromise] = useState<[() => void, () => void]>([() => {}, () => {}]);

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<void>((resolve, reject) => {
        setModalProps(options);
        setPromise([resolve, reject]);
        setOpen(true);
      })
        .catch(() => {})
        .finally(() => setOpen(false)),
    []
  );

  return (
    <ConfirmationModalContext.Provider value={{ confirm }}>
      {children}
      <ConfirmationModal
        {...modalProps}
        open={open}
        onOpenChange={setOpen}
        onConfirm={resolve}
        onCancel={reject}
      />
    </ConfirmationModalContext.Provider>
  );
};

export const useConfirmation = () => useContext(ConfirmationModalContext);
