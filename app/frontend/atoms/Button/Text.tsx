import { ComponentProps } from 'react';
import clsx from 'clsx';

const Text: React.FC<ComponentProps<'span'>> = ({ className, children, ...props }) => (
  <span className={clsx('button__text', className)} {...props}>
    {children}
  </span>
);

export default Text;
