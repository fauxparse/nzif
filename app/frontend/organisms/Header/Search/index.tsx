import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  autoUpdate,
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
import { AnimatePresence, motion, Variants } from 'framer-motion';

import Button from '../../../atoms/Button';
import Spinner from '../../../atoms/Spinner/Spinner';

import Result from './Result';
import useSearch, { tooShort } from './useSearch';

import './Search.css';

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

const SearchBox = () => {
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const left = useRef(0);
  const right = useRef(0);

  const resize = useCallback(() => {
    const header = ref.current?.closest('header');
    if (!header) return;
    if (header.clientWidth <= 1024) {
      const padding = parseFloat(getComputedStyle(header).paddingLeft || '0');
      left.current = padding - (ref.current?.getBoundingClientRect().left || 0);
      right.current =
        (ref.current?.getBoundingClientRect().right || 0) - (header.clientWidth - padding);
    } else {
      const logo = header.querySelector('.header__logo');
      left.current =
        (logo?.getBoundingClientRect().right || 0) +
        16 -
        (ref.current?.getBoundingClientRect().left || 0);
      right.current = 0;
    }
  }, []);

  const toggle = useCallback(
    () =>
      setOpen((open) => {
        if (!open) resize();
        return !open;
      }),
    [resize]
  );

  useEffect(() => {
    const header = ref.current?.closest('header');
    if (!header) return;

    const observer = new ResizeObserver(resize);
    resize();
    observer.observe(header);
    return () => observer.disconnect();
  }, [resize]);

  const { x, y, strategy, refs, context } = useFloating<HTMLDivElement>({
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
    middleware: [
      size({
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
        padding: 16,
      }),
      offset(16),
    ],
  });

  const [query, setQuery] = useState('');

  const { loading, error, results } = useSearch(query);

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

  const inputAnimationStart = (animation: 'expanded' | 'collapsed') => {
    const input = inputRef.current;

    if (input && animation === 'expanded') {
      setQuery('');
      input.focus();
    }
  };

  const containerAnimationStart = (animation: 'expanded' | 'collapsed') => {
    const container = ref.current?.querySelector('.search__inner');

    if (container && animation === 'collapsed') {
      container.setAttribute('data-collapsing', 'true');
    }
  };

  const containerAnimationComplete = (animation: 'expanded' | 'collapsed') => {
    const container = ref.current?.querySelector('.search__inner');

    if (container && animation === 'collapsed') {
      container.removeAttribute('data-collapsing');
    }
  };

  const navigate = useNavigate();

  const onClick = (result: { url: string }) => {
    setOpen(false);
    navigate(result.url);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && activeIndex != null && results[activeIndex]) {
      setActiveIndex(null);
      onClick(results[activeIndex]);
    }
  };

  return (
    <div ref={ref} className="search">
      <motion.div
        className="search__inner"
        variants={searchBoxVariants}
        aria-expanded={open || undefined}
        animate={open ? 'expanded' : 'collapsed'}
        custom={{ left: left.current, right: right.current }}
        {...getReferenceProps({
          ref: refs.setReference,
        })}
        onAnimationStart={containerAnimationStart}
        onAnimationComplete={containerAnimationComplete}
      >
        <Button toolbar icon="search" aria-label="search" onClick={() => toggle()} />
        <motion.input
          ref={inputRef}
          type="search"
          autoFocus
          placeholder="Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          variants={inputVariants}
          onAnimationStart={inputAnimationStart}
          onKeyDown={onKeyDown}
        />
        {open && (
          <Button
            toolbar
            icon={loading ? <Spinner /> : 'clear'}
            aria-label="Clear"
            onClick={() => toggle()}
          />
        )}
        <FloatingPortal>
          <AnimatePresence>
            {open && !tooShort(query) && (
              <FloatingFocusManager context={context} initialFocus={-1} visuallyHiddenDismiss>
                <motion.div
                  key="results"
                  className="search__results"
                  {...getFloatingProps({
                    ref: refs.setFloating,
                    style: {
                      position: strategy,
                      left: x ?? 0,
                      top: y ?? 0,
                    },
                  })}
                  variants={resultsVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                >
                  <AnimatePresence>
                    {results.map((result, index) => (
                      <Result
                        key={result.id}
                        result={result}
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
                        <Spinner medium />
                      ) : (
                        <p className="search__empty">Nothing matched your search.</p>
                      ))}
                  </AnimatePresence>
                </motion.div>
              </FloatingFocusManager>
            )}
          </AnimatePresence>
        </FloatingPortal>
      </motion.div>
    </div>
  );
};

export default SearchBox;
