import { useDisclosure } from '@/hooks/useDisclosure';
import CloseIcon from '@/icons/CloseIcon';
import NoResultsIcon from '@/icons/NoResultsIcon';
import SearchIcon from '@/icons/SearchIcon';
import {
  Box,
  ButtonProps,
  Dialog,
  Flex,
  Grid,
  IconButton,
  Inset,
  Kbd,
  ScrollArea,
  Skeleton,
  Text,
  TextField,
  Theme,
  VisuallyHidden,
  useThemeContext,
} from '@radix-ui/themes';
import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { mergeRefs } from 'react-merge-refs';
import { Key } from 'ts-key-enum';
import { Result } from './Result';
import { useSearch as defaultUseSearch } from './useSearch';

import { Spinner } from '@/components/atoms/Spinner';
import { useDarkMode } from '@/hooks/useDarkMode';
import { range } from 'lodash-es';
import classes from './Search.module.css';

export type SearchProps = ButtonProps & {
  useSearch?: typeof defaultUseSearch;
};

export const Search = forwardRef<HTMLButtonElement, SearchProps>(
  ({ className, useSearch = defaultUseSearch }, ref) => {
    const [opened, { open, close }] = useDisclosure(false);

    const {
      query,
      queryParts,
      setQuery,
      loading,
      results,
      reset,
      previousResult,
      nextResult,
      activeResult,
      selectActiveResult,
    } = useSearch({ onResultClick: close });

    useEffect(() => {
      if (opened) reset();
    }, [opened, reset]);

    const { isDarkMode } = useDarkMode();

    const { appearance } = useThemeContext();

    useHotkeys('/', open, { preventDefault: true });

    const hotkeys = mergeRefs([
      useHotkeys(Key.ArrowUp, previousResult, { enableOnFormTags: true, preventDefault: true }),
      useHotkeys(Key.ArrowDown, nextResult, { enableOnFormTags: true, preventDefault: true }),
      useHotkeys(Key.Enter, selectActiveResult, { enableOnFormTags: true, preventDefault: true }),
    ]);

    return (
      <Theme appearance={isDarkMode ? 'dark' : 'light'}>
        <Dialog.Root open={opened} onOpenChange={(opened) => (opened ? open : close)()}>
          <Theme appearance={appearance}>
            <Dialog.Trigger>
              <IconButton ref={ref} variant="ghost" size="4" radius="full" color="gray">
                <SearchIcon />
              </IconButton>
            </Dialog.Trigger>
          </Theme>
          <Dialog.Content className={classes.modal} asChild>
            <motion.div layoutId="search-results" layout="size" style={{ borderRadius: 9 }}>
              <VisuallyHidden>
                <Dialog.Title>Search</Dialog.Title>
                <Dialog.Description>Search for anything</Dialog.Description>
              </VisuallyHidden>
              <Inset>
                <Box py="2" asChild>
                  <motion.div layout>
                    <TextField.Root
                      ref={hotkeys}
                      className={classes.input}
                      placeholder="Search…"
                      aria-label="Search"
                      size="3"
                      radius="none"
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.currentTarget.value)}
                    >
                      <TextField.Slot>
                        <SearchIcon />
                      </TextField.Slot>
                      <TextField.Slot>
                        <Spinner loading={loading} color="gray">
                          <IconButton
                            variant="ghost"
                            size="2"
                            radius="full"
                            color="gray"
                            onClick={close}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Spinner>
                      </TextField.Slot>
                    </TextField.Root>
                  </motion.div>
                </Box>
                <ScrollArea>
                  <Grid className={classes.results} asChild>
                    <motion.div layout>
                      <AnimatePresence mode="wait" initial={false}>
                        {results.length ? (
                          results.map((result) => (
                            <motion.div
                              layout
                              key={result.id}
                              variants={{ out: { opacity: 0 }, in: { opacity: 1 } }}
                              initial="out"
                              animate="in"
                              exit="out"
                            >
                              <Result
                                key={result.id}
                                active={activeResult?.id === result.id}
                                {...result}
                                queryParts={queryParts}
                                onSelect={close}
                              />
                            </motion.div>
                          ))
                        ) : loading ? (
                          <>
                            {range(3).map((i) => (
                              <Box
                                asChild
                                key={-i}
                                className={classes.result}
                                style={{ pointerEvents: 'none' }}
                              >
                                <motion.div
                                  layout
                                  key={i}
                                  variants={{ out: { opacity: 0 }, in: { opacity: 1 } }}
                                  initial="out"
                                  animate="in"
                                  exit="out"
                                >
                                  <Skeleton>
                                    <SearchIcon />
                                  </Skeleton>
                                  <Text truncate className={classes.resultTitle}>
                                    <Skeleton>Loading…</Skeleton>
                                  </Text>
                                  <Text truncate className={classes.resultDescription}>
                                    <Skeleton>(no description)</Skeleton>
                                  </Text>
                                </motion.div>
                              </Box>
                            ))}
                          </>
                        ) : (
                          <Flex
                            direction="column"
                            align="center"
                            justify="center"
                            py="9"
                            gap="4"
                            asChild
                          >
                            <motion.div
                              layout
                              variants={{ out: { opacity: 0 }, in: { opacity: 1 } }}
                              initial="out"
                              animate="in"
                              exit="out"
                            >
                              {query ? (
                                <>
                                  <NoResultsIcon size="4" color="gray" />
                                  <Text color="gray">Sorry, nothing matched your search.</Text>
                                </>
                              ) : (
                                <>
                                  <SearchIcon size="4" color="gray" />
                                  <Text color="gray" align="center">
                                    Search for people, places, activities, or information.
                                  </Text>
                                  <Text color="gray" size="2" align="center">
                                    <b>Tip:</b> Search from any page by pressing <Kbd>/</Kbd>
                                  </Text>
                                </>
                              )}
                            </motion.div>
                          </Flex>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Grid>
                </ScrollArea>
              </Inset>
            </motion.div>
          </Dialog.Content>
        </Dialog.Root>
      </Theme>
    );
  }
);
