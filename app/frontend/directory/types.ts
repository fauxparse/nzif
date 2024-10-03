import { FragmentOf } from '@/graphql';
import { DirectoryResultFragment } from './queries';

export type Person = FragmentOf<typeof DirectoryResultFragment>;
