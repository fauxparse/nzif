import { isFunction } from 'lodash-es';
import { useEffect, useState } from 'react';
import { ComboboxItem, UseComboboxOptions } from './types';

export const useCombobox = <Item extends ComboboxItem, Value = Item | null>({
  items,
  debounce = 500,
  enableAdd = false,
  onSelect,
  onAdd,
}: UseComboboxOptions<Item, Value>) => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Item[]>(() => (isFunction(items) ? [] : items));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isFunction(items)) return;

    setResults(items);
  }, [items]);

  useEffect(() => {
    if (isFunction(items)) {
      if (query) setLoading(true);

      const timeout = setTimeout(() => {
        if (query) {
          items(query).then((results) => {
            setResults(results);
            setLoading(false);
          });
        } else {
          setResults([]);
          setLoading(false);
        }
      }, debounce);
      return () => clearTimeout(timeout);
    }

    setLoading(false);
    setResults(items);
  }, [query, items, debounce]);

  const openChanged = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setQuery('');
      if (isFunction(items)) setResults([]);
    }
  };

  const selected = (item: Item | null) => {
    onSelect(item);
    setOpen(false);
    setQuery('');
  };

  const add = (query: string) => {
    if (!enableAdd || !onAdd) return;

    onAdd(query).then((v) => {
      if (v) selected(v);
    });
  };

  return {
    async: isFunction(items),
    loading,
    query,
    results,
    open,
    setQuery,
    openChanged,
    selected,
    add,
  };
};
