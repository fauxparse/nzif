import { activityColor, activityTypeLabel } from '@/constants/activityTypes';
import { ActivityAttributes, ActivityType } from '@/graphql/types';
import ActivityIcon from '@/icons/ActivityIcon';
import PlusIcon from '@/icons/PlusIcon';
import { useLazyQuery } from '@apollo/client';
import { Box, Button, Combobox, Group, Loader, Text, TextInput, useCombobox } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { DateTime } from 'luxon';
import { useEffect, useRef, useState } from 'react';
import { ActivitySearchQuery } from './queries';
import { Activity } from './types';

type ActivityPickerProps = {
  value: Activity | null;
  startsAt?: DateTime;
  activityType: ActivityType;
  onAddActivity: (type: ActivityType, attributes: Partial<ActivityAttributes>) => Promise<Activity>;
  onChange: (value: Activity | null) => void;
};

export const ActivityPicker: React.FC<ActivityPickerProps> = ({
  value,
  activityType,
  startsAt,
  onAddActivity,
  onChange,
}) => {
  const [busy, setBusy] = useState(false);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const abort = useRef<AbortController>();

  const [options, setOptions] = useState<Activity[]>([]);

  const [query, setQuery] = useState<string>('');

  const [search, { loading, data }] = useLazyQuery(ActivitySearchQuery, {
    fetchPolicy: 'network-only',
    context: {
      fetchOptions: {
        signal: abort.current?.signal,
      },
      queryDeduplication: false,
    },
  });

  const handleSearch = (query: string) => {
    abort.current?.abort();
    abort.current = new AbortController();
    setBusy(true);
    search({ variables: { query, activityType } }).finally(() => setBusy(false));
  };

  useEffect(() => {
    if (!data) return;
    setOptions([
      ...((data.search
        ?.map((result) => ('activity' in result ? result.activity : null) as Activity | null)
        .filter(Boolean) ?? []) as Activity[]),
      ...(query
        ? [
            {
              id: 'add',
              name: query,
              type: activityType,
              slug: '',
            },
          ]
        : []),
    ]);
  }, [data]);

  const handleValueSelect = (id: string) => {
    combobox.closeDropdown();

    if (id === 'add') {
      setBusy(true);
      onAddActivity(activityType, { name: query })
        .then(onChange)
        .finally(() => {
          setBusy(false);
        });
    } else {
      onChange(options.find((activity) => activity.id === id) || null);
    }
    setQuery('');
  };

  const handleValueRemove = () => {
    setQuery('');
    onChange(null);
  };

  useEffect(() => {
    if (!query) setOptions([]);
  }, [query]);

  return (
    <Combobox
      store={combobox}
      middlewares={{ flip: false, shift: true, inline: false }}
      onOptionSubmit={(value) => handleValueSelect(value)}
    >
      <Combobox.Target>
        {value ? (
          <Box className="activity-picker__value" data-color={activityColor(value.type)}>
            <ActivityIcon activityType={value.type} />
            <Text className="activity-picker__value__name">{value.name}</Text>
            <Button
              component={Link}
              to="/admin/$activityType/$slug"
              params={{ activityType: value.type, slug: value.slug }}
              search={startsAt ? { session: startsAt.toISODate() } : {}}
              type="button"
              variant="outline"
              size="sm"
              data-color={activityColor(value.type)}
            >
              Details
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-color={activityColor(value.type)}
              onClick={handleValueRemove}
            >
              Remove
            </Button>
          </Box>
        ) : (
          <TextInput
            autoFocus
            data-autofocus
            size="md"
            className="activity-picker__input"
            value={query}
            onClick={() => combobox.toggleDropdown()}
            leftSection={<ActivityIcon activityType={activityType} />}
            rightSection={busy && <Loader size="sm" />}
            placeholder={`Add a ${activityTypeLabel(activityType)}…`}
            onChange={(e) => {
              setQuery(e.currentTarget.value);
              handleSearch(e.currentTarget.value);
              combobox.resetSelectedOption();
              combobox.openDropdown();
              combobox.updateSelectedOptionIndex();
            }}
          />
        )}
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length > 0 ? (
            options.map((option) => (
              <Combobox.Option key={option.id} value={String(option.id)}>
                <Group className="activity-picker__option">
                  {option.id === 'add' ? <PlusIcon /> : <ActivityIcon activityType={option.type} />}
                  <Text>{option.id === 'add' ? `Add “${option.name}”` : option.name}</Text>
                </Group>
              </Combobox.Option>
            ))
          ) : (
            <Combobox.Empty>{query ? 'No results' : 'Start typing…'}</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
