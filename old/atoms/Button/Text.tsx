import clsx from 'clsx';
import { ComponentProps } from 'react';

const Text: React.FC<ComponentProps<'span'>> = ({ className, children, ...props }) => (
  <span className={clsx('button__text', className)} {...props}>
    {children}
  </span>
);

export default Text;
