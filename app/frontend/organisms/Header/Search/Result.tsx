import React, { forwardRef } from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';

import Icon from '../../../atoms/Icon';
import { ActivityResult, PageResult, SearchQuery } from '../../../graphql/types';

type SearchResult = SearchQuery['search'][0];

type ResultProps = HTMLMotionProps<'div'> & {
  result: SearchResult;
  active?: boolean;
};

const isPageResult = (result): result is Partial<PageResult> => result.__typename === 'PageResult';
const isActivityResult = (result): result is Partial<ActivityResult> =>
  result.__typename === 'ActivityResult';

const Result = forwardRef<HTMLDivElement, ResultProps>(({ result, active, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      className="search__result"
      role="option"
      aria-selected={active}
      {...props}
    >
      <span />
      <div className="search__result__text">
        <div className="search__result__title">{result.title}</div>
        <div className="search__result__description">
          {isPageResult(result) ? result.lede : isActivityResult(result) && result.activity?.type}
        </div>
      </div>
      <Icon name="return" className="return-key" aria-label="Press enter to select this result" />
    </motion.div>
  );
});

Result.displayName = 'Result';

export default Result;
