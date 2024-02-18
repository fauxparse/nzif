import { AnimatePresence, Variants, motion } from 'framer-motion';
import { debounce } from 'lodash-es';
import { DateTime } from 'luxon';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTypedParams } from 'react-router-typesafe-routes/dom';

import Icon from '@/atoms/Icon';
import Input from '@/atoms/Input';
import Logo from '@/atoms/Logo';
import { DirectorySearchQuery, useDirectorySearchLazyQuery } from '@/graphql/types';
import InputGroup from '@/molecules/InputGroup';

import Result from './Result';
import { ROUTES } from './Routes';

const containerVariants: Variants = {
  out: {
    opacity: 0,
    scale: 0.9,
  },
  in: {
    opacity: 1,
    scale: 1,
  },
};

const listVariants: Variants = {
  out: {
    opacity: 0,
    transition: { delay: 0.2 },
  },
  in: {
    opacity: 1,
    transition: { delay: 0.2 },
  },
};

const Search: React.FC = () => {
  const { timeslot } = useTypedParams(ROUTES.DIRECTORY.TIMESLOT);
  const { id } = useTypedParams(ROUTES.DIRECTORY.TIMESLOT.PERSON);

  const date = useMemo(
    () => (timeslot ? DateTime.fromFormat(timeslot, 'y-MM-dd-hhmm') : DateTime.now()),
    [timeslot]
  );

  const [results, setResults] = useState<DirectorySearchQuery['directorySearch']>([]);

  const [directorySearch, { data }] = useDirectorySearchLazyQuery();

  useEffect(() => {
    setResults(data?.directorySearch || []);
  }, [data]);

  useEffect(() => {
    if (!id) setResults([]);
  }, [id]);

  const search = useMemo(
    () =>
      debounce(
        (query) => {
          if (query.length < 1) {
            setResults([]);
          } else {
            directorySearch({ variables: { query } });
          }
        },
        50,
        { leading: false, trailing: true }
      ),
    [directorySearch]
  );

  const changed = (e: React.ChangeEvent<HTMLInputElement>) => {
    search(e.currentTarget.value);
  };

  if (!timeslot) return null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {id ? (
        <Result key={id} />
      ) : (
        <motion.div
          key="search"
          className="search"
          data-overlaid={!!id || undefined}
          variants={containerVariants}
          initial="out"
          animate="in"
          exit="out"
        >
          <h2>
            <Link to={ROUTES.DIRECTORY.path}>{date.toFormat('EEEE d MMMM, h:mm a')}</Link>
          </h2>
          <InputGroup large>
            <InputGroup.Icon name="search" />
            <Input
              type="text"
              name="search"
              placeholder="Type your name…"
              autoComplete="off"
              autoFocus
              onChange={changed}
              htmlSize={1}
            />
          </InputGroup>
          <AnimatePresence mode="popLayout">
            {results.length > 0 ? (
              <motion.ul
                key="results"
                className="search__results"
                variants={listVariants}
                initial="out"
                animate="in"
                exit="out"
              >
                <AnimatePresence mode="popLayout">
                  {results.map((result) => (
                    <li key={result.id}>
                      <Link
                        to={ROUTES.DIRECTORY.TIMESLOT.PERSON.buildPath({ timeslot, id: result.id })}
                      >
                        <Icon name="user" />
                        <span>{result.name}</span>
                      </Link>
                    </li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            ) : (
              <motion.div
                key="logo"
                className="search__logo"
                variants={listVariants}
                initial="out"
                animate="in"
                exit="out"
              >
                <Logo />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Search;
