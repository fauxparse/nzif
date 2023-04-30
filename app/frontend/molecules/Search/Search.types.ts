import { ComponentProps } from 'react';

import { IconName } from '@/atoms/Icon';
import { Maybe } from '@/graphql/types';

export interface SearchResult {
  id: string;
  title: string;
  description: Maybe<string>;
  url: string;
  icon?: IconName;
}

export type SearchFunction = (query: string) => Promise<SearchResult[]>;

export type SearchProps = ComponentProps<'div'> & {
  onMeasure: (el: HTMLDivElement) => { left: number; right: number };
  onSearch: SearchFunction;
  onResultClick: (result: SearchResult) => void;
};
