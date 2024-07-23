import { Combobox, ComboboxItem } from '@/components/molecules/Combobox';
import CloseIcon from '@/icons/CloseIcon';
import UserIcon from '@/icons/UserIcon';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Badge, IconButton } from '@radix-ui/themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PresenterSearchQuery, UpdateActivityPresentersMutation } from './queries';
import { Presenter, Session } from './types';

import comboboxClasses from '@/components/molecules/Combobox/Combobox.module.css';
import { map } from 'lodash-es';

type SearchResult = ComboboxItem & { person: Presenter };

type Activity = NonNullable<Session['activity']>;

type ActivityPresentersProps = {
  activity: Activity;
};

export const ActivityPresenters: React.FC<ActivityPresentersProps> = ({ activity: initial }) => {
  const [activity, setActivity] = useState(initial);

  const abort = useRef<AbortController>();

  useEffect(() => {
    setActivity(initial);
  }, [initial]);

  const [search] = useLazyQuery(PresenterSearchQuery, {
    fetchPolicy: 'network-only',
    context: {
      fetchOptions: {
        signal: abort.current?.signal,
      },
      queryDeduplication: false,
    },
  });

  const handleSearch = useCallback(
    (query: string) =>
      new Promise<SearchResult[]>((resolve) => {
        abort.current?.abort();
        abort.current = new AbortController();
        search({ variables: { query } }).then(({ data }) => {
          if (data?.search) {
            resolve(
              data.search.flatMap((result) =>
                'person' in result
                  ? [
                      {
                        id: result.person.id,
                        label: result.person.name,
                        person: result.person,
                      },
                    ]
                  : []
              )
            );
          }
        });
      }),
    [search]
  );

  const [update] = useMutation(UpdateActivityPresentersMutation);

  const handleValueSelect = useCallback(
    (result: SearchResult | null) => {
      if (!result) return;

      const presenters = [...activity.presenters, result.person];

      update({
        variables: {
          id: activity.id,
          presenters: map(presenters, 'id'),
        },
        optimisticResponse: {
          updateActivity: {
            activity: {
              ...activity,
              presenters,
            },
          },
        },
      }).then(({ data }) => {
        if (data?.updateActivity) {
          setActivity(data.updateActivity.activity);
        }
      });
    },
    [update, activity]
  );

  const handleRemove = useCallback(
    (person: Presenter) => {
      if (!person) return;

      const presenters = activity.presenters.filter((p) => p.id !== person.id);

      update({
        variables: {
          id: activity.id,
          presenters: map(presenters, 'id'),
        },
        optimisticResponse: {
          updateActivity: {
            activity: {
              ...activity,
              presenters,
            },
          },
        },
      }).then(({ data }) => {
        if (data?.updateActivity) {
          setActivity(data.updateActivity.activity);
        }
      });
    },
    [update, activity]
  );

  return (
    <Combobox.Root<SearchResult, Presenter[]>
      icon={<UserIcon />}
      placeholder="Add a presenter…"
      value={activity.presenters}
      items={handleSearch}
      input={({ ...props }) => (
        <Combobox.Multiple
          {...props}
          item={({ item, onRemove }) => (
            <Badge
              key={item.id}
              variant="surface"
              className={comboboxClasses.multiInputValue}
              size="3"
            >
              {item.name}
              <IconButton
                className={comboboxClasses.multiInputRemove}
                type="button"
                variant="ghost"
                size="2"
                onClick={onRemove}
              >
                <CloseIcon />
              </IconButton>
            </Badge>
          )}
          onRemoveItem={handleRemove}
        />
      )}
      onSelect={handleValueSelect}
    />
  );
};
