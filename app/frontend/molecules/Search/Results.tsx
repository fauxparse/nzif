import { AnimatePresence, HTMLMotionProps, Variants, motion } from 'framer-motion';
import { range } from 'lodash-es';
import React, { forwardRef, HTMLProps } from 'react';

import Result from './Result';
import { SearchResult } from './Search.types';

type BaseResultsProps = {
  loading: boolean;
  results: SearchResult[];
  getItemProps?: (userProps?: HTMLProps<HTMLElement> | undefined) => Record<string, unknown>;
  listRef: React.MutableRefObject<(HTMLElement | null)[]>;
  activeIndex: number | null;
  onClick: (result: SearchResult) => void;
};

type ResultProps = Omit<HTMLMotionProps<'div'>, keyof BaseResultsProps> & BaseResultsProps;

const resultsVariants: Variants = {
  expanded: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', bounce: 0.2, delay: 0.5 },
  },
  collapsed: {
    opacity: 0,
    y: -50,
  },
};

const Results = forwardRef<HTMLDivElement, ResultProps>(
  (
    {
      loading,
      results,
      listRef,
      activeIndex,
      getItemProps = () => ({}),
      onClick,
      ...props
    }: ResultProps,
    ref
  ) => (
    <motion.div
      key="results"
      className="search__results"
      ref={ref}
      variants={resultsVariants}
      initial="collapsed"
      animate="expanded"
      exit="collapsed"
      {...props}
    >
      <AnimatePresence>
        {results.map((result, index) => (
          <Result
            key={result.id}
            {...result}
            {...getItemProps({
              key: result.id,
              ref: (node) => {
                listRef.current[index] = node;
              },
            })}
            active={activeIndex === index}
            onClick={() => onClick(result)}
          />
        ))}
        {!results.length &&
          (loading ? (
            <>
              {range(3).map((i) => (
                <Result loading key={i} />
              ))}
            </>
          ) : (
            <p className="search__empty">Nothing matched your search.</p>
          ))}
      </AnimatePresence>
    </motion.div>
  )
);

Results.displayName = 'Search.Results';

export default Results;
