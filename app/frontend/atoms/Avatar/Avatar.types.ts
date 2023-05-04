import { ComponentPropsWithoutRef } from 'react';
import { Maybe } from 'graphql/jsutils/Maybe';

import { PropsWithVariants } from '@/types/variants';

export enum AvatarSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export const AVATAR_VARIANTS = {
  size: {
    values: AvatarSize,
    defaultValue: AvatarSize.SMALL,
  },
} as const;

export type AvatarVariants = PropsWithVariants<typeof AVATAR_VARIANTS>;

export type AvatarProps = Omit<ComponentPropsWithoutRef<'div'>, 'size'> &
  AvatarVariants & {
    url: Maybe<string>;
    name: string;
  };
