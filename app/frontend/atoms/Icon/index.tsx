import { ReactNode } from 'react';
import { isString } from 'lodash-es';

import Icon from './Icon';
import { IconProps } from './Icon.types';
import ICONS, { IconName } from './icons';

export type { IconName, IconProps };

export const isIconName = (name: ReactNode): name is IconName => isString(name) && name in ICONS;

export default Icon;
