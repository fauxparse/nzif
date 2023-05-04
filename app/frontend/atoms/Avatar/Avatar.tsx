import React from 'react';
import clsx from 'clsx';

import Icon from '../Icon';
import { extractVariants } from '@/types/variants';

import { AVATAR_VARIANTS, AvatarProps, AvatarVariants } from './Avatar.types';

import './Avatar.css';

const useCustomAvatar = <T extends AvatarVariants>(props: T): T =>
  extractVariants(AVATAR_VARIANTS, props);

export const Avatar: React.FC<AvatarProps> = ({ className, url, name, children, ...props }) => {
  const { size, ...avatarProps } = useCustomAvatar(props);

  return (
    <div className={clsx('avatar', className)} data-size={size} {...avatarProps}>
      {url ? <img src={url} alt={name} /> : <Icon name="user" />}
    </div>
  );
};

export default Avatar;
