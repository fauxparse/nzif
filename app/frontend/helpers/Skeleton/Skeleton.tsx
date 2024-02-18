import clsx from 'clsx';
import { ElementType, forwardRef, useMemo } from 'react';

import { extractVariants } from '@/types/variants';

import {
  AllSkeletonVariants,
  SKELETON_VARIANTS,
  SkeletonComponent,
  SkeletonShape,
} from './Skeleton.types';

import './Skeleton.css';

const useCustomSkeleton = <T extends AllSkeletonVariants>(props: T): T =>
  extractVariants(SKELETON_VARIANTS, props);

export const Skeleton: SkeletonComponent = forwardRef(
  ({ as, loading = true, className, children, lines = 5, ...props }, ref) => {
    const Component = (as || 'div') as ElementType;

    const { shape, ...skeletonProps } = useCustomSkeleton(props);

    const lineLengths = useMemo(() => {
      const lengths = Array.from({ length: lines - 1 }).map(() => Math.random() * 15 + 85);
      lengths.push(Math.random() * 25 + 15);
      return lengths;
    }, [lines]);

    if (!loading) return <>{children}</>;

    if (shape === SkeletonShape.PARAGRAPH) {
      return (
        <>
          {lineLengths.map((length, i) => (
            <Skeleton
              data-shape="text"
              key={i}
              {...skeletonProps}
              style={{ width: `${length}%` }}
            />
          ))}
        </>
      );
    }

    return (
      <Component
        ref={ref}
        className={clsx('skeleton', className)}
        data-shape={shape}
        aria-hidden
        {...skeletonProps}
      >
        {children}
      </Component>
    );
  }
);

Skeleton.displayName = 'Skeleton';

export default Skeleton;
