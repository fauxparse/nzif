import { FragmentOf } from 'gql.tada';
import {
  WorkshopAllocationRegistrationFragment,
  WorkshopAllocationSessionDetailsFragment,
} from './queries';

export type Session = FragmentOf<typeof WorkshopAllocationSessionDetailsFragment>;
export type Registration = FragmentOf<typeof WorkshopAllocationRegistrationFragment>;
