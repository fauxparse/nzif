import { Button, ButtonProps } from '@radix-ui/themes';
import clsx from 'clsx';

import classes from './ActionList.module.css';

export type ItemProps = ButtonProps & {
  icon?: React.ReactNode;
  disabled?: boolean;
};

export const ActionListItem: React.FC<ItemProps> = ({ className, icon, ...props }) => (
  <Button className={clsx(classes.item, className)} role="menuitem" {...props} />
);

ActionListItem.displayName = 'ActionList.Item';
