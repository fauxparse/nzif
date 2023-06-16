import { RegistrationWorkshopFragment, RegistrationSlotFragment } from '@/graphql/types';

export type SelectedWorkshop = {
  slot: RegistrationSlotFragment;
  workshop: RegistrationWorkshopFragment;
};
