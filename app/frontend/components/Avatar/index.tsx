import UserIcon from '@/icons/UserIcon';
import {
  Avatar as BaseAvatar,
  AvatarProps as BaseAvatarProps,
  createPolymorphicComponent,
} from '@mantine/core';
import initials from 'initials';
import { forwardRef, useMemo } from 'react';

import './Avatar.css';
import clsx from 'clsx';

type AvatarUser = {
  profile: {
    name: string;
    picture: {
      small: string;
    } | null;
  } | null;
};

type AvatarSize = 'small' | 'medium' | 'large';

const DEFAULT_SIZE = 'medium';

type AvatarProps = Omit<BaseAvatarProps, 'size'> & {
  user: AvatarUser | null;
  size?: AvatarSize;
};

const Avatar = createPolymorphicComponent<
  typeof BaseAvatar,
  AvatarProps,
  { Group: typeof BaseAvatar.Group }
>(
  forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, user, size = DEFAULT_SIZE, ...props }, ref) => {
      const name = user?.profile?.name || '';
      const userInitials = useMemo(() => initials(name), [name]);

      return (
        <BaseAvatar
          ref={ref}
          className={clsx('avatar', className)}
          {...props}
          data-size={size}
          src={user?.profile?.picture?.small ?? null}
          alt={name}
        >
          {userInitials || <UserIcon />}
        </BaseAvatar>
      );
    }
  )
);

Avatar.Group = BaseAvatar.Group;

export default Avatar;
