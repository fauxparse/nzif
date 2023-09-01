import { ReactNode, useCallback, useState } from 'react';

import Button from '@/atoms/Button';
import Dialog, { DialogProps } from '@/organisms/Dialog';

type ConfirmationModalProps = DialogProps & {
  title?: string;
  message?: ReactNode;
  confirm?: string;
  cancel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title = 'Are you sure?',
  confirm = 'Yes, I’m sure',
  cancel = 'Cancel',
  message = '',
  onOpenChange,
  onConfirm,
  onCancel,
  ...props
}) => {
  const confirmClicked = () => {
    onOpenChange(false);
    onConfirm();
  };

  const cancelClicked = () => {
    onOpenChange(false);
    onCancel();
  };

  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      <Dialog.Header>
        <Dialog.Title>{title}</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>{message}</Dialog.Body>
      <Dialog.Footer>
        <Button text={cancel} onClick={cancelClicked} />
        <Button text={confirm} onClick={confirmClicked} />
      </Dialog.Footer>
    </Dialog>
  );
};

export type ConfirmOptions = Pick<
  ConfirmationModalProps,
  'title' | 'message' | 'confirm' | 'cancel'
>;

export const useConfirmation = () => {
  const [open, setOpen] = useState(false);

  const [options, setOptions] = useState<ConfirmOptions>({});

  const [confirmCallback, setConfirmCallback] = useState<() => void>(() => () => void 0);

  const [cancelCallback, setCancelCallback] = useState<() => void>(() => () => void 0);

  const confirm = useCallback(
    (opts: ConfirmOptions) =>
      new Promise<void>((resolve, reject) => {
        setOptions(opts);
        setConfirmCallback(() => () => resolve());
        setCancelCallback(() => () => reject());
        setOpen(true);
      }),
    []
  );

  const modal = (
    <ConfirmationModal
      open={open}
      {...options}
      onOpenChange={setOpen}
      onConfirm={confirmCallback}
      onCancel={cancelCallback}
    />
  );

  return { confirm, modal };
};

export default ConfirmationModal;
