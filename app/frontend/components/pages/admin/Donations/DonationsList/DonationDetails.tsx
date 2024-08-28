import CloseIcon from '@/icons/CloseIcon';
import { Dialog, Flex, IconButton, VisuallyHidden } from '@radix-ui/themes';
import { FragmentOf } from 'gql.tada';
import { DonationsRowFragment } from './queries';

type DonationDetailsProps = {
  donation: FragmentOf<typeof DonationsRowFragment>;
  onClose: () => void;
};

export const DonationDetails: React.FC<DonationDetailsProps> = ({ donation, onClose }) => {
  return (
    <Dialog.Content>
      <Flex justify="between" align="start">
        <Flex direction="column">
          <Dialog.Title mb="0">Donation details</Dialog.Title>
        </Flex>
        <IconButton variant="ghost" radius="full" color="gray" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Flex>
      <VisuallyHidden>
        <Dialog.Description>Donation details</Dialog.Description>
      </VisuallyHidden>
    </Dialog.Content>
  );
};
