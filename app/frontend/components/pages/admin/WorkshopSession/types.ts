import { FragmentOf } from '@/graphql';
import { SessionRegistrationFragment, WorkshopSessionFragment } from './queries';

export type Session = FragmentOf<typeof WorkshopSessionFragment>;

export type Registration = FragmentOf<typeof SessionRegistrationFragment>;

export type ListId = 'participants' | 'waitlist' | 'trash';
