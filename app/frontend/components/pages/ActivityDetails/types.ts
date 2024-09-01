import { FragmentOf } from '@/graphql';
import { ActivityDetailsActivityFragment } from './queries';

export type Activity = FragmentOf<typeof ActivityDetailsActivityFragment>;

export type SessionId = Activity['sessions'][number]['id'];
