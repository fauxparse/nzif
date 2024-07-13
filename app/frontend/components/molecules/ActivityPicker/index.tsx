import { SearchResult } from '@/components/organisms/Search/types';
import SearchIcon from '@/icons/SearchIcon';
import * as Popover from '@radix-ui/react-popover';
import { Avatar, Box, Flex, Skeleton, Text, TextField } from '@radix-ui/themes';
import clsx from 'clsx';
import { Command } from 'cmdk';
import { useEffect, useRef, useState } from 'react';

import ActivityIcon from '@/icons/ActivityIcon';
import NoResultsIcon from '@/icons/NoResultsIcon';
import { range } from 'lodash-es';
import classes from './ActivityPicker.module.css';

type ActivityPickerProps = {
  size?: '1' | '2' | '3';
  onSearch: (query: string) => Promise<SearchResult[]>;
};

export const ActivityPicker: React.FC<ActivityPickerProps> = ({ size = '3', onSearch }) => {
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const [results, setResults] = useState<SearchResult[]>([]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (query) setLoading(true);

    const timeout = setTimeout(() => {
      if (query) {
        onSearch(query).then((results) => {
          setResults(results);
          setLoading(false);
        });
      } else {
        setResults([]);
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  const openChanged = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setQuery('');
      setResults([]);
    }
  };

  return (
    <Popover.Root modal={false} open={open} onOpenChange={openChanged}>
      <Command filter={() => 1}>
        <Popover.Anchor asChild>
          <div
            className={clsx('rt-TextFieldRoot', 'rt-variant-surface', `rt-r-size-${size}`)}
            onPointerDown={(event) => {
              const input = inputRef.current;
              if (!input) return;

              const target = event.target as HTMLElement;
              if (target.closest('input, button, a')) return;

              // Same selector as in the CSS to find the right slot
              const isRightSlot = target.closest(`
              .rt-TextFieldSlot[data-side='right'],
              .rt-TextFieldSlot:not([data-side='right']) ~ .rt-TextFieldSlot:not([data-side='left'])
            `);

              const cursorPosition = isRightSlot ? input.value.length : 0;

              requestAnimationFrame(() => {
                // Only some input types support this, browsers will throw an error if not supported
                // See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange#:~:text=Note%20that%20according,not%20support%20selection%22.
                try {
                  input.setSelectionRange(cursorPosition, cursorPosition);
                } catch (e) {}
                input.focus();
              });
            }}
          >
            <Command.Input
              ref={inputRef}
              className="rt-reset rt-TextFieldInput"
              placeholder="Search"
              value={query}
              onValueChange={setQuery}
              onFocus={() => setOpen(true)}
            />
            <TextField.Slot>
              <SearchIcon />
            </TextField.Slot>
          </div>
        </Popover.Anchor>

        <Popover.Content
          className={classes.popup}
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            if (e.target === inputRef.current) e.preventDefault();
          }}
        >
          {open && (
            <Command.List>
              {loading && (
                <Command.Loading>
                  <Empty loading />
                </Command.Loading>
              )}

              <Command.Empty>
                <Empty loading={loading} hasQuery={!!query} />
              </Command.Empty>

              {results.map((result) => (
                <Command.Item key={result.id} className={classes.result} value={result.title}>
                  {result.__typename === 'ActivityResult' && (
                    <ActivityIcon activityType={result.activity.type} />
                  )}{' '}
                  <Text truncate>{result.title}</Text>
                </Command.Item>
              ))}
            </Command.List>
          )}
        </Popover.Content>
        {!open && <Command.List />}
      </Command>
    </Popover.Root>
  );
};

const Empty: React.FC<{ loading: boolean; hasQuery?: boolean }> = ({
  loading,
  hasQuery = false,
}) =>
  loading ? (
    <>
      {range(5).map((i) => (
        <Box key={i} className={classes.result}>
          <Skeleton>
            <Avatar size="1" fallback="" radius="full" />
          </Skeleton>
          <Skeleton width={`${(Math.cos(i) + 2) * 15 + 40}%`} height="1em" />
        </Box>
      ))}
    </>
  ) : (
    <Flex direction="column" align="center" justify="center" py="9" gap="4">
      {hasQuery ? (
        <>
          <NoResultsIcon size="4" color="gray" />
          <Text color="gray">Sorry, nothing matched your search</Text>
        </>
      ) : (
        <>
          <SearchIcon size="4" color="gray" />
          <Text color="gray">Start typing to search</Text>
        </>
      )}
    </Flex>
  );
