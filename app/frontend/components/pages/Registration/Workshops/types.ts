import { RegistrationDetailsFragment } from '@/services/Registration/queries';
import { FragmentOf } from 'gql.tada';
import { DateTime } from 'luxon';
import { RegistrationWorkshopFragment } from './queries';

export type Registration = FragmentOf<typeof RegistrationDetailsFragment>;
export type Workshop = FragmentOf<typeof RegistrationWorkshopFragment>;
export type Session = Workshop['sessions'][number] & { workshop: Workshop };

export const PERIODS = ['all-day', 'morning', 'afternoon'] as const;
export type Period = (typeof PERIODS)[number];

export type WorkshopDay = {
  date: DateTime;
  workshops: Record<Period, Session[]>;
};
