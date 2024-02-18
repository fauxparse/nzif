import clsx from 'clsx';
import React, { ElementType, forwardRef, useLayoutEffect, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';

import { extractVariants } from '@/types/variants';

import { Orientation, SCROLLABLE_VARIANTS, ScrollableComponent } from './Scrollable.types';

import './Scrollable.css';

export const Scrollable: ScrollableComponent = forwardRef(
  ({ as, className, children, ...props }, ref) => {
    const Component = (as || 'div') as ElementType;

    const ownRef = useRef<HTMLDivElement>(null);

    const startEdge = useRef<HTMLSpanElement>(null);
    const endEdge = useRef<HTMLSpanElement>(null);

    const { orientation = Orientation.HORIZONTAL, ...scrollableProps } = extractVariants(
      SCROLLABLE_VARIANTS,
      props
    );

    useLayoutEffect(() => {
      const root = ownRef.current;
      if (!root || !startEdge.current || !endEdge.current) return;

      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            root.style.setProperty(
              `--${(entry.target as HTMLElement).dataset.edge}-edge`,
              entry.isIntersecting ? '0' : '1'
            );
          }
        },
        { root: ownRef.current, threshold: 0.9 }
      );

      intersectionObserver.observe(startEdge.current);
      intersectionObserver.observe(endEdge.current);

      return () => intersectionObserver.disconnect();
    }, []);

    return (
      <Component
        ref={mergeRefs([ref, ownRef])}
        className={clsx('scrollable', className)}
        data-orientation={orientation}
        {...scrollableProps}
      >
        <div className="scrollable__content">
          <span ref={startEdge} className="scrollable__edge" data-edge="start" aria-hidden />
          {children}
          <span ref={endEdge} className="scrollable__edge" data-edge="end" aria-hidden />
        </div>
      </Component>
    );
  }
);

Scrollable.displayName = 'Scrollable';

export default Scrollable;
