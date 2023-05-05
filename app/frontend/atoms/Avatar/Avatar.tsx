import React from 'react';
import clsx from 'clsx';

import Icon from '../Icon';
import { extractVariants } from '@/types/variants';

import { AVATAR_VARIANTS, AvatarProps, AvatarVariants } from './Avatar.types';

import './Avatar.css';

const useCustomAvatar = <T extends AvatarVariants>(props: T): T =>
  extractVariants(AVATAR_VARIANTS, props);

const initialize = (name: string) =>
  name
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

export const Avatar: React.FC<AvatarProps> = ({ className, url, name, children, ...props }) => {
  const { size, ...avatarProps } = useCustomAvatar(props);

  return (
    <div className={clsx('avatar', className)} data-size={size} {...avatarProps}>
      {url && name ? (
        <img src={url} alt={name} />
      ) : name ? (
        <span className="avatar__initials">{initialize(name)}</span>
      ) : (
        <Icon name="user" />
      )}
    </div>
  );
};

export default Avatar;
