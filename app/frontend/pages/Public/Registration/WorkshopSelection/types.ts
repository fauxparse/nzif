import {
  RegistrationSessionFragment,
  RegistrationSlotFragment,
  RegistrationWorkshopFragment,
} from '@/graphql/types';

export type SelectedWorkshop = {
  slot: RegistrationSlotFragment;
  workshop: RegistrationWorkshopFragment;
};

export type WorkshopSession = RegistrationSessionFragment & {
  workshop: NonNullable<RegistrationSessionFragment['workshop']>;
};
