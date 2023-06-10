import { RegistrationWorkshopFragment, RegistrationWorkshopSlotFragment } from '@/graphql/types';

export type SelectedWorkshop = {
  slot: RegistrationWorkshopSlotFragment;
  workshop: RegistrationWorkshopFragment;
};
