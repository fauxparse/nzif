import Icon from './Icon';
import { IconProps } from './Icon.types';
import ICONS, { IconName } from './icons';

export type { IconName, IconProps };

export const isIconName = (name): name is IconName => !!ICONS[name];

export default Icon;
