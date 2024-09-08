import CloseIcon from '@/icons/CloseIcon';
import { Dialog, Flex, IconButton, VisuallyHidden } from '@radix-ui/themes';
import { FragmentOf } from 'gql.tada';
import { PaymentsRowFragment } from './queries';

type PaymentDetailsProps = {
  payment: FragmentOf<typeof PaymentsRowFragment>;
  onClose: () => void;
};

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({ payment, onClose }) => {
  return (
    <Dialog.Content>
      <Flex justify="between" align="start">
        <Flex direction="column">
          <Dialog.Title mb="0">Payment details</Dialog.Title>
        </Flex>
        <IconButton variant="ghost" radius="full" color="gray" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Flex>
      <VisuallyHidden>
        <Dialog.Description>Payment details</Dialog.Description>
      </VisuallyHidden>
    </Dialog.Content>
  );
};
