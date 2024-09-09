import { Table } from '@radix-ui/themes';
import clsx from 'clsx';

import classes from './DataTable.module.css';

export const DataTable: React.FC<Table.RootProps> = ({ className, children, ...props }) => (
  <Table.Root
    className={clsx(classes.table, className)}
    size={{ initial: '2', sm: '3' }}
    {...props}
  >
    {children}
  </Table.Root>
);
