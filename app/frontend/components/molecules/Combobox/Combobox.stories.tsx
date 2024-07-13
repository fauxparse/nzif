import SearchIcon from '@/icons/SearchIcon';
import UsersIcon from '@/icons/UsersIcon';
import { StoryDefault } from '@ladle/react';
import {
  Avatar,
  Badge,
  Box,
  Callout,
  Card,
  Flex,
  IconButton,
  Inset,
  Text,
  Theme,
} from '@radix-ui/themes';
import { CSSProperties, useCallback, useState } from 'react';
import { Combobox } from '.';

import CloseIcon from '@/icons/CloseIcon';
import UserIcon from '@/icons/UserIcon';
import { uniqueId } from 'lodash-es';
import classes from './Combobox.module.css';

const ITEMS = [
  { id: '2a', label: 'Judith Deuteros', house: 'II' },
  { id: '2b', label: 'Marta Dyas', house: 'II' },
  { id: '3a', label: 'Ianthe Tridentarius', house: 'III' },
  { id: '3b', label: 'Coronabeth Tridentarius', house: 'III' },
  { id: '3c', label: 'Naberius Tern', house: 'III' },
  { id: '4a', label: 'Isaac Tettares', house: 'IV' },
  { id: '4b', label: 'Jeannemary Chatur', house: 'IV' },
  { id: '5a', label: 'Abigail Pent', house: 'V' },
  { id: '5b', label: 'Magnus Quinn', house: 'V' },
  { id: '6a', label: 'Palamedes Sextus', house: 'VI' },
  { id: '6b', label: 'Camilla Hect', house: 'VI' },
  { id: '7a', label: 'Dulcinea Septimus', house: 'VII' },
  { id: '7b', label: 'Protesilaus Ebdoma', house: 'VII' },
  { id: '8a', label: 'Silas Octakiseron', house: 'VIII' },
  { id: '8b', label: 'Colum Asht', house: 'VIII' },
  { id: '9a', label: 'Harrowhark Nonagesimus', house: 'IX' },
  { id: '9b', label: 'Gideon Nav', house: 'IX' },
];

type Character = (typeof ITEMS)[number];

export const Simple = () => {
  const [value, setValue] = useState<Character | null>(null);

  return (
    <Flex direction="column" gap="2">
      <Combobox.Root icon={<SearchIcon />} items={ITEMS} value={value} onSelect={setValue} />
      {value && (
        <Callout.Root>
          <Callout.Icon>
            <UserIcon />
          </Callout.Icon>
          <Callout.Text>{value.label}</Callout.Text>
        </Callout.Root>
      )}
    </Flex>
  );
};

export const Multiple = () => {
  const [value, setValue] = useState<Character[]>([]);

  return (
    <Combobox.Root
      icon={<UsersIcon />}
      input={(props) => (
        <Combobox.Multiple
          {...props}
          onRemoveItem={(item) => setValue((current) => current.filter((i) => i.id !== item.id))}
        />
      )}
      items={ITEMS}
      value={value}
      onSelect={(item) => {
        if (item && !value.find((i) => i.id === item.id)) setValue((current) => [...current, item]);
      }}
    />
  );
};

export const Custom = () => {
  const [value, setValue] = useState<(typeof ITEMS)[number][]>([]);

  return (
    <Combobox.Root
      items={ITEMS}
      input={({ ...props }) => (
        <Combobox.Multiple
          {...props}
          item={({ item, onRemove }) => (
            <Badge
              key={item.id}
              variant="solid"
              color="gray"
              className={classes.multiInputValue}
              size="3"
            >
              <Avatar
                size="1"
                radius="full"
                fallback={item.house}
                style={{
                  fontSize: 'var(--font-size-1)',
                  marginLeft: '-0.25rem',
                  backgroundColor: 'var(--gray-1)',
                  color: 'var(--gray-12)',
                }}
              />
              {item.label}
              <IconButton
                className={classes.multiInputRemove}
                variant="ghost"
                size="2"
                onClick={onRemove}
              >
                <CloseIcon />
              </IconButton>
            </Badge>
          )}
          onRemoveItem={(item) => setValue((current) => current.filter((i) => i.id !== item.id))}
        />
      )}
      item={({ item, onSelect }) => (
        <Combobox.Item
          className={classes.result}
          value={item.label}
          onSelect={() => onSelect(item)}
        >
          <Avatar
            size="1"
            radius="full"
            fallback={item.house}
            style={{ fontSize: 'var(--font-size-1)' }}
          />
          <Text truncate>{item.label}</Text>
        </Combobox.Item>
      )}
      value={value}
      onSelect={(item) => {
        if (item && !value.find((i) => i.id === item.id)) setValue((current) => [...current, item]);
      }}
    />
  );
};

export const Async = () => {
  const [value, setValue] = useState<Character | null>(null);

  const fetch = useCallback(
    (query: string) =>
      new Promise<Character[]>((resolve) => {
        const regex = new RegExp(query, 'i');
        setTimeout(() => {
          resolve(ITEMS.filter((item) => regex.test(item.label)));
        }, 100);
      }),
    []
  );

  return (
    <Flex direction="column" gap="2">
      <Combobox.Root icon={<SearchIcon />} items={fetch} value={value} onSelect={setValue} />
      {value && (
        <Callout.Root>
          <Callout.Icon>
            <UserIcon />
          </Callout.Icon>
          <Callout.Text>{value.label}</Callout.Text>
        </Callout.Root>
      )}
    </Flex>
  );
};

export const Add = () => {
  const [items, setItems] = useState<Character[]>(ITEMS);

  const [value, setValue] = useState<Character | null>(null);

  const add = useCallback(
    (query: string) =>
      new Promise<Character>((resolve) => {
        const id = uniqueId();
        const item = { id, label: query, house: '??' } satisfies Character;
        setItems((current) => [...current, item]);
        resolve(item);
      }),
    []
  );

  const fetch = useCallback(
    (query: string) =>
      new Promise<Character[]>((resolve) => {
        const regex = new RegExp(query, 'i');
        setTimeout(() => {
          resolve(items.filter((item) => regex.test(item.label)));
        }, 100);
      }),
    [items]
  );

  return (
    <Flex direction="column" gap="2">
      <Combobox.Root
        icon={<SearchIcon />}
        items={fetch}
        value={value}
        enableAdd
        onSelect={setValue}
        onAdd={add}
      />
      {value && (
        <Callout.Root>
          <Callout.Icon>
            <UserIcon />
          </Callout.Icon>
          <Callout.Text>{value.label}</Callout.Text>
        </Callout.Root>
      )}
    </Flex>
  );
};

export const WithCard = () => {
  const [value, setValue] = useState<Character | null>(null);

  return (
    <Combobox.Root
      icon={value ? null : <SearchIcon />}
      items={ITEMS}
      value={value}
      input={(props) =>
        value ? (
          <Theme accentColor="cyan" asChild>
            <Inset style={{ flex: 1 }}>
              <Card
                size="1"
                style={
                  {
                    '--card-padding': 'var(--space-2)',
                    minHeight: 'var(--text-field-height)',
                  } as CSSProperties
                }
              >
                <Flex gap="3" align="center">
                  <Avatar size="1" radius="full" fallback={value.house} />
                  <Box flexGrow="1" asChild>
                    <Text>{value.label}</Text>
                  </Box>
                  <IconButton
                    variant="ghost"
                    size="2"
                    color="gray"
                    radius="full"
                    onClick={() => setValue(null)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Flex>
              </Card>
            </Inset>
          </Theme>
        ) : (
          <Combobox.Input {...props} />
        )
      }
      onSelect={setValue}
    />
  );
};

export default {
  title: 'Molecules/Combobox',
} as StoryDefault;
