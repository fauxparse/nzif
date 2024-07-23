import { FragmentOf } from 'gql.tada';
import { RegistrationDetailsFragment } from './queries';

export type Registration = FragmentOf<typeof RegistrationDetailsFragment>;
