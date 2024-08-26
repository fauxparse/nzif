import { FragmentOf } from 'gql.tada';
import {
  WorkshopAllocationRegistrationFragment,
  WorkshopAllocationSessionDetailsFragment,
} from './queries';

export type Session = FragmentOf<typeof WorkshopAllocationSessionDetailsFragment>;
export type Registration = FragmentOf<typeof WorkshopAllocationRegistrationFragment>;
export type Slot = Session['slots'][number];

export type Unassigned = { id: 'unassigned'; slots: Session['slots'] };

export const isUnassigned = (session: Session | Unassigned): session is Unassigned =>
  session.id === 'unassigned';
