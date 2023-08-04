import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';

import { ActivityPickerProps } from './ActivityPicker.types';
import ActivitySearch from './ActivitySearch';
import NewActivity from './NewActivity';

import './ActivityPicker.css';

type Mode = 'search' | 'new';

export const ActivityPicker: React.FC<ActivityPickerProps> = ({
  activityType,
  onSearch,
  onCreate,
  onSelect,
}) => {
  const [mode, setMode] = useState<Mode>('search');

  const [name, setName] = useState('');

  const [height, setHeight] = useState(0);

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;

    const resize = () => {
      setHeight(el.offsetHeight || 0);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    resize();
    return () => observer.disconnect();
  }, []);

  const handleNewActivity = (name: string) => {
    setName(name);
    setMode('new');
  };

  return (
    <MotionConfig transition={{ type: 'spring', bounce: 0.2 }}>
      <motion.div
        className="activity-picker"
        style={{ width: 384, position: 'relative', overflow: 'hidden' }}
        animate={{ height, transition: { type: 'spring', bounce: 0.2, when: 'beforeChildren' } }}
        initial={false}
      >
        <div ref={container}>
          <AnimatePresence initial={false} mode="popLayout">
            {mode === 'search' && (
              <motion.div
                key="search"
                className="activity-picker__search"
                initial={{ x: -384 }}
                animate={{ x: 0 }}
                exit={{ x: -384 }}
              >
                <ActivitySearch
                  activityType={activityType}
                  onSearch={onSearch}
                  onNewActivity={handleNewActivity}
                  onSelect={onSelect}
                />
              </motion.div>
            )}
            {mode === 'new' && (
              <motion.div
                key="new"
                className="activity-picker__new"
                initial={{ x: 384 }}
                animate={{ x: 0 }}
                exit={{ x: 384 }}
              >
                <NewActivity
                  activityType={activityType}
                  defaultName={name}
                  onBack={() => setMode('search')}
                  onCreate={onCreate}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </MotionConfig>
  );
};

ActivityPicker.displayName = 'ActivityPicker';

export default ActivityPicker;
