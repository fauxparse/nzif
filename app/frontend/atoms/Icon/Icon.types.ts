import { ComponentPropsWithoutRef } from 'react';

import { IconName } from './icons';

export type { IconName };

type CustomIcon = {
  path?: string;
};

type NamedIcon = {
  name: IconName;
};

export type IconProps = ComponentPropsWithoutRef<'svg'> & (NamedIcon | CustomIcon);
