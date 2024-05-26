import { getActivityColor } from '@/constants/activityTypes';
import { ActivityType } from '@/graphql/types';
import { ActivityIcon } from '@/icons/ActivityIcon';
import PlusIcon from '@/icons/PlusIcon';
import { useLazyQuery } from '@apollo/client';
import { Box, Button, Combobox, Group, Text, TextInput, useCombobox } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { ActivitySearchQuery } from './queries';
import { Activity } from './types';

type ActivityPickerProps = {
  value: Activity | null;
  activityType: ActivityType;
  onDetailsClick: (activity: Activity) => void;
  onAddActivity: (activity: Activity) => void;
  onChange: (value: Activity | null) => void;
};

export const ActivityPicker: React.FC<ActivityPickerProps> = ({
  value,
  activityType,
  onDetailsClick,
  onAddActivity,
  onChange,
}) => {
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
    search({ variables: { query, activityType } });
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
    setQuery('');
    combobox.closeDropdown();

    if (id === 'add') {
      onAddActivity({
        id: query,
        name: query,
        type: activityType,
        slug: '',
      });
    } else {
      onChange(options.find((activity) => activity.id === id) || null);
    }
  };

  const handleValueRemove = () => {
    setQuery('');
    onChange(null);
  };

  return (
    <Combobox
      store={combobox}
      middlewares={{ flip: false, shift: true, inline: false }}
      onOptionSubmit={(value) => handleValueSelect(value)}
    >
      <Combobox.Target>
        {value ? (
          <Box className="activity-picker__value" data-color={getActivityColor(value.type)}>
            <ActivityIcon activityType={value.type} />
            <Text className="activity-picker__value__name">{value.name}</Text>
            <Button
              type="button"
              variant="filled"
              size="sm"
              data-color={getActivityColor(value.type)}
              onClick={() => onDetailsClick(value)}
            >
              Details
            </Button>
            <Button
              type="button"
              variant="filled"
              size="sm"
              data-color={getActivityColor(value.type)}
              onClick={handleValueRemove}
            >
              Remove
            </Button>
          </Box>
        ) : (
          <TextInput
            size="md"
            className="activity-picker__input"
            value={query}
            onClick={() => combobox.toggleDropdown()}
            leftSection={<ActivityIcon activityType={activityType} />}
            placeholder="Add an activity…"
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
