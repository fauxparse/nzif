import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from '@floating-ui/react';
import clsx from 'clsx';
import { AnimatePresence } from 'framer-motion';
import { useDebounce } from 'usehooks-ts';

import Input from './Input';
import Results from './Results';
import { SearchProps, SearchResult } from './Search.types';

import './Search.css';

const tooShort = (query: string) => query.length < 3;

export const Search = forwardRef<HTMLInputElement, SearchProps>(
  ({ className, onMeasure, onSearch, onResultClick, onKeyDown, ...props }, ref) => {
    const ownRef = useRef<HTMLDivElement>(null);

    const [expanded, setExpanded] = useState(false);

    const [query, setQuery] = useState('');

    const [searching, setSearching] = useState(false);

    const debouncedQuery = useDebounce(query, 500);

    const [results, setResults] = useState<SearchResult[]>([]);

    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(0);

    useEffect(() => {
      if (expanded) setQuery('');
    }, [expanded]);

    const resize = useCallback(() => {
      const el = ownRef.current;
      if (!el) return;

      const { left, right } = onMeasure(el);
      setLeft(left);
      setRight(right);
    }, [onMeasure]);

    useEffect(() => {
      const parent = ownRef.current?.offsetParent;

      if (!parent) return;

      const observer = new ResizeObserver(resize);
      resize();
      observer.observe(parent);
      return () => observer.disconnect();
    }, [resize]);

    const performSearch = useCallback(
      (query: string) => {
        setSearching(true);
        onSearch(query).then((results) => {
          setResults(results);
          setSearching(false);
        });
      },
      [onSearch]
    );

    useEffect(() => {
      if (!tooShort(debouncedQuery)) performSearch(debouncedQuery);
    }, [debouncedQuery, performSearch]);

    const { x, y, strategy, refs, context } = useFloating<HTMLDivElement>({
      whileElementsMounted: autoUpdate,
      open: expanded,
      onOpenChange: setExpanded,
      middleware: [
        size({
          apply({ rects, elements }) {
            Object.assign(elements.floating.style, {
              width: `${rects.reference.width}px`,
              maxHeight: `336px`,
            });
          },
          padding: 16,
        }),
        offset(16),
        flip(),
      ],
    });

    const listRef = useRef<Array<HTMLElement | null>>([]);

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const role = useRole(context, { role: 'listbox' });
    const dismiss = useDismiss(context);
    const listNavigation = useListNavigation(context, {
      listRef,
      activeIndex,
      onNavigate: setActiveIndex,
      virtual: true,
      loop: true,
    });

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
      role,
      dismiss,
      listNavigation,
    ]);

    const resultClicked = (result: SearchResult) => {
      setExpanded(false);
      onResultClick(result);
    };

    const keyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (expanded && event.key === 'Enter' && activeIndex != null && results[activeIndex]) {
        resultClicked(results[activeIndex]);
      }
      onKeyDown?.(event);
    };

    return (
      <div className={clsx('search', className)} ref={mergeRefs([ref, ownRef])} {...props}>
        <Input
          left={left}
          right={right}
          expanded={expanded}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          onExpandedChange={setExpanded}
          {...getReferenceProps({
            ref: refs.setReference,
            onKeyDown: keyDown,
            onFocus: (e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.select(),
          })}
        />
        <FloatingPortal>
          <AnimatePresence>
            {expanded && !tooShort(query) && (
              <FloatingFocusManager context={context} initialFocus={-1} visuallyHiddenDismiss>
                <Results
                  loading={searching}
                  results={results}
                  listRef={listRef}
                  activeIndex={activeIndex}
                  onClick={resultClicked}
                  getItemProps={getItemProps}
                  {...getFloatingProps({
                    ref: refs.setFloating,
                    style: {
                      position: strategy,
                      left: x ?? 0,
                      top: y ?? 0,
                    },
                  })}
                />
              </FloatingFocusManager>
            )}
          </AnimatePresence>
        </FloatingPortal>
      </div>
    );
  }
);

Search.displayName = 'Search';

export default Search;
