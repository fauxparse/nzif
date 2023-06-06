import { ElementType, ReactElement } from 'react';

import { Polymorphic, WithDisplayName } from '@/types/polymorphic.types';
import { PropsWithVariants } from '@/types/variants';

export enum SkeletonShape {
  TEXT = 'text',
  RECTANGULAR = 'rectangular',
  ROUNDED = 'rounded',
  CIRCULAR = 'circular',
  PARAGRAPH = 'paragraph',
}

export const SKELETON_VARIANTS = {
  shape: {
    values: SkeletonShape,
    defaultValue: SkeletonShape.RECTANGULAR,
  },
} as const;

export type AllSkeletonVariants = PropsWithVariants<typeof SKELETON_VARIANTS>;

type ParagraphSkeletonProps = Extract<
  AllSkeletonVariants,
  { shape: SkeletonShape.PARAGRAPH } | { paragraph: true }
> & { lines?: number };

export type BaseSkeletonProps = (AllSkeletonVariants | ParagraphSkeletonProps) & {
  loading?: boolean;
};

export type SkeletonProps<C extends ElementType = 'div'> = Polymorphic<C, BaseSkeletonProps>;

export type SkeletonComponent = WithDisplayName<
  <C extends ElementType = 'div'>(props: SkeletonProps<C>) => ReactElement | null
>;
