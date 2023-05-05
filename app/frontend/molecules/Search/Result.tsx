import React, { forwardRef } from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';

import Avatar from '@/atoms/Avatar';
import Icon from '@/atoms/Icon';

import { SearchResult } from './Search.types';

type BaseResultProps = { loading: true } | (SearchResult & { loading?: false });

type ListItemProps = {
  active?: boolean;
};

type ResultProps = Omit<HTMLMotionProps<'div'>, keyof BaseResultProps> &
  BaseResultProps &
  ListItemProps;

const Result = forwardRef<HTMLDivElement, ResultProps>(({ active, ...props }: ResultProps, ref) => {
  const {
    title = null,
    description = null,
    loading = false,
    icon = undefined,
    image = undefined,
    ...resultProps
  } = props as ResultProps & Partial<SearchResult>;

  return (
    <motion.div
      ref={ref}
      className="search__result"
      role="option"
      aria-selected={active}
      aria-busy={loading}
      {...resultProps}
    >
      {loading ? (
        <span className="icon--skeleton" />
      ) : icon === 'user' ? (
        <Avatar name={title} url={image} />
      ) : (
        <Icon name={icon} />
      )}
      <div className="search__result__text">
        <div className="search__result__title">{!loading && title}</div>
        <div className="search__result__description">{!loading && description}</div>
      </div>
      <Icon name="return" className="return-key" aria-label="Press enter to select this result" />
    </motion.div>
  );
});

Result.displayName = 'Search.Result';

export default Result;
