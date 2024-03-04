import Button from '@/components/atoms/Button';
import TextInput from '@/components/atoms/TextInput';
import CloseIcon from '@/icons/CloseIcon';
import SearchIcon from '@/icons/SearchIcon';
import { Modal, ModalProps } from '@mantine/core';
import { getHotkeyHandler, useDebouncedValue } from '@mantine/hooks';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import SearchQuery from './query';
import { useLazyQuery, useQuery } from '@apollo/client';
import { ResultOf } from '@/graphql';
import SearchResult, { Result, linkProps } from './SearchResult';
import { useNavigate } from '@tanstack/react-router';
import { getPluralFromActivityType } from '@/constants/activityTypes';
import { ActivityType } from '@/graphql/types';
import Kbd from '@/components/atoms/Kbd';
import TipIcon from '@/icons/TipIcon';
import NoResultsIcon from '@/icons/NoResultsIcon';

type SearchModalProps = ModalProps & {
  maxResults?: number;
};

const SearchModal: React.FC<SearchModalProps> = ({ maxResults = 5, opened, onClose, ...props }) => {
  const [query, setQuery] = useState('');

  const [debouncedQuery] = useDebouncedValue(query, 300);

  const [doSearch] = useLazyQuery(SearchQuery);

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
      doSearch({ variables: { query: debouncedQuery } }).then(({ data }) => {
        setResults((data?.search || []).slice(0, maxResults));
        setActiveIndex(0);
      });
    }
  }, [debouncedQuery, maxResults]);

  const activeResult = results.length ? results[activeIndex] : null;

  const queryParts = query.split(/\s+/);

  const navigate = useNavigate();

  const navigateToResult = (result: Result) => {
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
      style={{ '--max-results': maxResults } as CSSProperties}
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
        onChange={(e) => setQuery(e.currentTarget.value)}
        leftSection={<SearchIcon />}
        rightSection={
          <Button
            variant="ghost"
            size="large"
            aria-label="Close"
            left={<CloseIcon />}
            onClick={onClose}
          />
        }
        role="searchbox"
        aria-owns={results.length ? results.map((r) => r.id).join(' ') : undefined}
        aria-activedescendant={(activeResult && String(activeResult.id)) ?? undefined}
      />
      {query ? (
        results.length ? (
          <div className="search-modal__results" role="menu">
            {results.map((result) => (
              <SearchResult
                key={result.url}
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
