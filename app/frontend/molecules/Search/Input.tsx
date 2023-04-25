import React, { forwardRef, useRef, useState } from 'react';
import { HTMLMotionProps, motion, Variants } from 'framer-motion';

import Button from '@/atoms/Button';
import Spinner from '@/atoms/Spinner/Spinner';

export type InputProps = HTMLMotionProps<'input'> & {
  left: number;
  right: number;
  expanded: boolean;
  onExpandedChange?: (expanded: boolean) => void;
};

const searchBoxVariants: Variants = {
  expanded: ({ left, right }: { left: number; right: number }) => ({
    left,
    right,
    transition: { type: 'spring', bounce: 0.2 },
  }),
  collapsed: {
    left: 0,
    right: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1], when: 'afterChildren' },
  },
};

const inputVariants: Variants = {
  expanded: {
    opacity: 1,
  },
  collapsed: {
    opacity: 0,
  },
};

const Input = forwardRef<HTMLDivElement, InputProps>(
  ({ left, right, expanded, onExpandedChange, ...props }, ref) => {
    const [query, setQuery] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);

    const toggle = () => {
      if (!expanded) {
        inputRef.current?.focus();
      }
      onExpandedChange?.(!expanded);
    };

    const containerAnimationStart = () => void 0;
    const containerAnimationComplete = () => void 0;
    const inputAnimationStart = () => void 0;
    const onKeyDown = () => void 0;
    const loading = false;

    return (
      <motion.div
        ref={ref}
        className="search__input"
        variants={searchBoxVariants}
        aria-expanded={expanded || undefined}
        animate={expanded ? 'expanded' : 'collapsed'}
        custom={{ left, right }}
        onAnimationStart={containerAnimationStart}
        onAnimationComplete={containerAnimationComplete}
      >
        <Button ghost icon="search" aria-label="search" onClick={() => toggle()} />
        <motion.input
          ref={inputRef}
          type="search"
          placeholder="Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          variants={inputVariants}
          onAnimationStart={inputAnimationStart}
          onKeyDown={onKeyDown}
          {...props}
        />
        {expanded && (
          <>
            <Button
              ghost
              icon={loading ? <Spinner /> : 'clear'}
              aria-label="Clear"
              onClick={() => toggle()}
            />
          </>
        )}
      </motion.div>
    );
  }
);

Input.displayName = 'Search.Input';

export default Input;
