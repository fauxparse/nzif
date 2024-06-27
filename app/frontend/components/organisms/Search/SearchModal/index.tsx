import type { ResultOf } from '@/graphql';
import CloseIcon from '@/icons/CloseIcon';
import NoResultsIcon from '@/icons/NoResultsIcon';
import SearchIcon from '@/icons/SearchIcon';
import TipIcon from '@/icons/TipIcon';
import { useLazyQuery } from '@apollo/client';
import { ActionIcon, Kbd, Modal, ModalProps, TextInput } from '@mantine/core';
import { getHotkeyHandler, useDebouncedValue } from '@mantine/hooks';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { SearchQuery } from '../queries';
import { SearchResult } from '../types';
import { linkProps } from './Result';
import { Result } from './Result';

type SearchModalProps = ModalProps & {
  maxResults?: number;
};

const SearchModal: React.FC<SearchModalProps> = ({
  maxResults = 10,
  opened,
  onClose,
  ...props
}) => {
  const [query, setQuery] = useState('');

  const [debouncedQuery] = useDebouncedValue(query, 300);

  const [doSearch] = useLazyQuery(SearchQuery, {
    fetchPolicy: 'network-only',
  });

  const [results, setResults] = useState<ResultOf<typeof SearchQuery>['search']>([]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (opened) {
      setQuery('');
      setResults([]);
    }
  }, [opened]);

  useEffect(() => {
    if (debouncedQuery) {
      doSearch({ variables: { query: debouncedQuery.trim() } }).then(({ data }) => {
        setResults((data?.search || []).slice(0, maxResults));
        setActiveIndex(0);
      });
    }
  }, [debouncedQuery, maxResults]);

  const activeResult = results.length ? results[activeIndex] : null;

  const queryParts = query.split(/\s+/);

  const navigate = useNavigate();

  const navigateToResult = (result: SearchResult) => {
    onClose();
    navigate(linkProps(result) as Parameters<typeof navigate>[0]);
  };

  const selectResult = () => {
    if (activeResult) {
      navigateToResult(activeResult);
    }
  };

  return (
    <Modal
      className="search-modal"
      centered
      size="lg"
      transitionProps={{ transition: 'slide-up' }}
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      role="search"
      onKeyDown={getHotkeyHandler([
        ['ArrowDown', () => setActiveIndex((i) => Math.min(i + 1, results.length - 1))],
        ['ArrowUp', () => setActiveIndex((i) => Math.max(i - 1, 0))],
        ['Enter', selectResult],
      ])}
      {...props}
    >
      <TextInput
        id="search"
        placeholder="Search..."
        value={query}
        size="md"
        onChange={(e) => setQuery(e.currentTarget.value)}
        leftSection={<SearchIcon />}
        rightSection={
          <ActionIcon
            variant="subtle"
            data-color="neutral"
            radius="lg"
            size="lg"
            aria-label="Close"
            onClick={onClose}
          >
            <CloseIcon />
          </ActionIcon>
        }
        role="searchbox"
        aria-owns={results.length ? results.map((r) => r.id).join(' ') : undefined}
        aria-activedescendant={(activeResult && String(activeResult.id)) ?? undefined}
      />
      {query ? (
        results.length ? (
          <div className="search-modal__results" role="menu">
            {results.map((result) => (
              <Result
                key={result.id}
                result={result}
                active={activeResult === result}
                queryParts={queryParts}
                onSelect={navigateToResult}
              />
            ))}
          </div>
        ) : (
          <div className="search-modal__no-results">
            <NoResultsIcon size="huge" />
            <p>Sorry, nothing matched your search.</p>
          </div>
        )
      ) : (
        <div className="search-modal__blank">
          <SearchIcon size="huge" />
          <p>Search for people, pages, or activities.</p>
          <p>
            <b>
              <TipIcon /> Tip:
            </b>{' '}
            You can search from any page by pressing <Kbd>/</Kbd>
          </p>
        </div>
      )}
    </Modal>
  );
};

export default SearchModal;
