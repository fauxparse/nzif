import NoResultsIcon from '@/icons/NoResultsIcon';
import SearchIcon from '@/icons/SearchIcon';
import * as Popover from '@radix-ui/react-popover';
import { Avatar, Box, Flex, Skeleton, Text, Theme } from '@radix-ui/themes';
import { Command } from 'cmdk';
import { range } from 'lodash-es';
import { ForwardRefExoticComponent, Fragment, useEffect, useRef } from 'react';
import { SingleValueInput } from './SingleValueInput';
import { ComboboxInputProps, ComboboxItem, ComboboxProps, ListItemProps } from './types';
import { useCombobox } from './useCombobox';

import PlusIcon from '@/icons/PlusIcon';
import clsx from 'clsx';
import classes from './Combobox.module.css';
import { InputWrapper } from './InputWrapper';
import { ListItem } from './ListItem';

export const Combobox = <Item extends ComboboxItem, Value = Item>({
  className,
  size = '3',
  value = null,
  items,
  input = (props: ComboboxInputProps<Item, Value>) => {
    const InputComponent = SingleValueInput as ForwardRefExoticComponent<
      ComboboxInputProps<Item, Value> & React.RefAttributes<HTMLDivElement>
    >;
    return <InputComponent {...props} />;
  },
  item = (props: ListItemProps<Item>) => <ListItem {...props} />,
  enableAdd = false,
  onAdd,
  onSelect,
  ...props
}: ComboboxProps<Item, Value>) => {
  const { async, loading, query, results, open, setQuery, openChanged, selected, add } =
    useCombobox({
      value,
      items,
      enableAdd,
      onSelect,
      onAdd,
      ...props,
    });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!!query && document.activeElement === inputRef.current && !open) {
      setTimeout(() => openChanged(true));
    }
  }, [query]);

  return (
    <Popover.Root modal={false} open={open} onOpenChange={openChanged}>
      <Command filter={async ? () => 1 : undefined}>
        <Popover.Anchor asChild>
          <InputWrapper className={className} {...props} inputRef={inputRef}>
            {input({
              inputRef,
              size,
              query,
              value,
              onQueryChange: setQuery,
              onFocus: () => openChanged(true),
              ...props,
            })}
          </InputWrapper>
        </Popover.Anchor>

        <Popover.Portal>
          <Theme asChild>
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
                  {loading && !results.length && (
                    <Command.Loading>
                      <Empty loading />
                    </Command.Loading>
                  )}

                  <Command.Empty>
                    <Empty loading={loading} hasQuery={!!query} />
                  </Command.Empty>

                  {results.map((result) => (
                    <Fragment key={result.id}>
                      {item({ item: result, onSelect: selected })}
                    </Fragment>
                  ))}

                  {enableAdd && onAdd && query && !loading && (
                    <>
                      <Command.Separator alwaysRender={results.length > 0} />
                      <Command.Item
                        value={query}
                        onSelect={() => add(query)}
                        className={clsx(classes.result, classes.addItem)}
                      >
                        <PlusIcon />
                        <Text truncate>Add “{query}”</Text>
                      </Command.Item>
                    </>
                  )}
                </Command.List>
              )}
            </Popover.Content>
          </Theme>
        </Popover.Portal>
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
