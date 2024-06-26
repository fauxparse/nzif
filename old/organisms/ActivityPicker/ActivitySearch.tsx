import { AnimatePresence, motion } from 'framer-motion';
import { camelCase } from 'lodash-es';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from 'usehooks-ts';

import Icon, { IconName } from '@/atoms/Icon';
import Input from '@/atoms/Input';
import { TimetableActivityFragment } from '@/graphql/types';
import Popover from '@/molecules/Popover';
import Search from '@/molecules/Search';
import activityTypeLabel from '@/util/activityTypeLabel';

import { ActivityPickerProps, ActivityResult } from './ActivityPicker.types';

type ActivitySearchProps = Pick<ActivityPickerProps, 'activityType' | 'onSearch'> & {
  onNewActivity: (name: string) => void;
  onSelect: (activity: TimetableActivityFragment) => void;
};

export const ActivitySearch: React.FC<ActivitySearchProps> = ({
  activityType,
  onSearch,
  onNewActivity,
  onSelect,
}) => {
  const searchBox = useRef<HTMLInputElement>(null);

  const placeholder = `Search for a ${activityTypeLabel(activityType).toLowerCase()}…`;

  const [query, setQuery] = React.useState('');

  const debouncedQuery = useDebounce(query, 500);

  const [results, setResults] = useState<ActivityResult[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (debouncedQuery.length < 3) {
      setResults([]);
      return;
    }

    onSearch(debouncedQuery).then((results) => {
      setResults(results);
      setActiveIndex(0);
    });
  }, [onSearch, debouncedQuery]);

  const options = useMemo(
    () => [
      ...(results || []),
      ...(debouncedQuery
        ? [
            {
              id: 'new',
              title: debouncedQuery,
              description: `Create new ${activityTypeLabel(activityType).toLowerCase()}`,
              url: `/admin/timetable/${activityType}/new`,
              icon: 'new',
            },
          ]
        : []),
    ],
    [debouncedQuery, results, activityType]
  );

  const select = (result: ActivityResult) => {
    if (result.id === 'new') {
      onNewActivity(result.title);
    } else {
      onSelect(result.activity);
    }
  };

  const keyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        e.preventDefault();
        if (!results.length) return;
        setActiveIndex(
          (current) => (current + options.length + (e.key === 'ArrowUp' ? -1 : 1)) % options.length
        );
        break;
      case 'Enter':
        e.preventDefault();
        select(options[activeIndex] as ActivityResult);
        break;
    }
  };

  useEffect(() => {
    const input = searchBox.current;
    if (!input) return;

    const timeout = setTimeout(() => {
      input.focus();
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <header className="activity-picker__header">
        <Icon name="search" />
        <Input
          ref={searchBox}
          large
          type="search"
          placeholder={placeholder}
          value={query}
          onKeyDown={keyDown}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        />
        <Popover.Close />
      </header>
      {options.length > 0 && (
        <div className="activity-picker__results">
          <AnimatePresence mode="popLayout">
            {options.map((result, i) => (
              <motion.div
                key={result.id}
                layout="position"
                initial={{ opacity: 0, y: -32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Search.Result
                  key={result.id}
                  icon={camelCase(activityType) as IconName}
                  {...(result as ActivityResult)}
                  active={activeIndex === i}
                  onClick={() => select(result as ActivityResult)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default ActivitySearch;
