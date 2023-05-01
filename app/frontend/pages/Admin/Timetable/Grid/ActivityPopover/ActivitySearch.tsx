import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { camelCase } from 'lodash-es';
import { useDebounce } from 'usehooks-ts';

import Button from '@/atoms/Button';
import { IconName } from '@/atoms/Icon';
import Input from '@/atoms/Input';
import {
  ActivityResult,
  ActivitySearchQuery,
  ActivityType,
  SearchResult,
  SlotAttributes,
  TimetableSlotFragment,
  useActivitySearchQuery,
  useUpdateSlotMutation,
} from '@/graphql/types';
import InputGroup from '@/molecules/InputGroup';
import Popover, { usePopoverContext } from '@/molecules/Popover';
import Search from '@/molecules/Search';
import activityTypeLabel from '@/util/activityTypeLabel';

type ActivitySearchProps = {
  activityType: ActivityType;
  slot: TimetableSlotFragment;
};

const isActivityResult = (result: SearchResult): result is ActivityResult => 'activity' in result;

type Mode = 'search' | 'new';

const variants: Variants = {
  left: {
    // x: -384,
    transition: { ease: [0.4, 0, 0.2, 1] },
  },
  in: {
    // x: 0,
    transition: { ease: [0.4, 0, 0.2, 1] },
  },
  right: {
    // x: -384,
    transition: { ease: [0.4, 0, 0.2, 1] },
  },
};

const ActivitySearch: React.FC<ActivitySearchProps> = ({ activityType, slot }) => {
  const placeholder = `Search for a ${activityTypeLabel(activityType).toLowerCase()}…`;

  const { setOpen } = usePopoverContext();

  const [mode, setMode] = useState<Mode>('search');

  const [query, setQuery] = useState('');

  const debouncedQuery = useDebounce(query, 500);

  const { data } = useActivitySearchQuery({
    variables: {
      query: debouncedQuery,
      activityType,
    },
  });

  const [results, setResults] = useState<SearchResult[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (data?.search) {
      setResults(data.search);
      setActiveIndex(0);
    }
  }, [data]);

  const options = useMemo(
    () => [
      ...(results || []),
      ...(query
        ? [
            {
              id: 'new',
              title: query,
              description: `Create new ${activityTypeLabel(activityType).toLowerCase()}`,
              url: `/admin/timetable/${activityType}/new`,
              icon: 'new',
            },
          ]
        : []),
    ],
    [query, results, activityType]
  );

  const [updateSlot] = useUpdateSlotMutation();

  const select = (result: SearchResult) => {
    if (result.id === 'new') {
      setMode('new');
    } else if (isActivityResult(result)) {
      setOpen(false);
      updateSlot({
        variables: {
          id: slot.id,
          attributes: {
            activityId: result.activity.id,
          } as SlotAttributes,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateSlot: {
            __typename: 'UpdateSlotPayload',
            slot: {
              ...slot,
              activity: {
                __typename: activityType,
                ...result.activity,
              },
            },
          },
        },
      });
    }
  };

  const keyDown = (e: React.KeyboardEvent) => {
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
        select(options[activeIndex]);
        break;
    }
  };

  return (
    <motion.div layout="size" style={{ overflow: 'hidden' }}>
      <AnimatePresence mode="popLayout" initial={false}>
        {mode === 'search' ? (
          <motion.div key="search" variants={variants} initial="left" animate="in" exit="left">
            <motion.div key="search-inner" layout="position">
              <Popover.Header className="activity-picker__search">
                <InputGroup large>
                  <InputGroup.Icon name="search" />
                  <Input
                    type="search"
                    placeholder={placeholder}
                    autoFocus
                    value={query}
                    onKeyDown={keyDown}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                  />
                  <InputGroup.AddOn>
                    <Popover.Close />
                  </InputGroup.AddOn>
                </InputGroup>
              </Popover.Header>
              {options.length > 0 && (
                <Popover.Body>
                  <div className="activity-picker__results">
                    {options.map((result, i) => (
                      <Search.Result
                        key={result.id}
                        icon={camelCase(activityType) as IconName}
                        {...(result as SearchResult)}
                        active={activeIndex === i}
                        onClick={() => select(result)}
                      />
                    ))}
                  </div>
                </Popover.Body>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="new" variants={variants} initial="right" animate="in" exit="right">
            <motion.div layout>
              <Button icon="arrowLeft" aria-label="Back" onClick={() => setMode('search')} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ActivitySearch;
