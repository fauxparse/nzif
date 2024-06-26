import { ComponentPropsWithoutRef } from 'react';

import { IconName } from './icons';

export type { IconName };

export type IconProps = Omit<ComponentPropsWithoutRef<'svg'>, 'name'> & {
  name?: IconName;
  path?: string;
};
