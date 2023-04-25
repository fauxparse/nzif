import { forwardRef } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import { TabComponent } from './Tabs.types';

const Tab: TabComponent = forwardRef(
  ({ as, className, selected, text, children, ...props }, ref) => {
    const Component = as || 'button';

    return (
      <>
        <Component
          ref={ref}
          className={clsx('tab', className)}
          type="button"
          role="tab"
          aria-selected={selected}
          {...props}
        >
          {text && <span className="tab__text">{text}</span>}
          {selected && (
            <motion.div
              layoutId="highlight"
              className="tab__highlight"
              transition={{ type: 'spring', bounce: 0.2 }}
            />
          )}
        </Component>
      </>
    );
  }
);

Tab.displayName = 'Tab';

export default Tab;
