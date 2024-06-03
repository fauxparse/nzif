import { FragmentOf } from 'gql.tada';
import { PickablePersonFragment } from './queries';

export type Person = FragmentOf<typeof PickablePersonFragment>;
