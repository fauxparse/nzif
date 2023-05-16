import { Fragment, ReactNode, useEffect, useMemo, useReducer, useState } from 'react';
import { map, maxBy, startCase } from 'lodash-es';

import Button from '@/atoms/Button';
import Icon from '@/atoms/Icon';
import Placename from '@/atoms/Placename';
import { PeopleDocument, PersonDetailsFragment, useMergeProfilesMutation } from '@/graphql/types';
import Dialog from '@/organisms/Dialog';

type MergeDialogProps = {
  open: boolean;
  people: PersonDetailsFragment[];
  onOpenChange: (open: boolean) => void;
};

type MergeableField = {
  name: keyof PersonDetailsFragment;
  label?: string;
  value?: (person: PersonDetailsFragment) => ReactNode;
};

const FIELDS: MergeableField[] = [
  { name: 'name' },
  { name: 'pronouns' },
  {
    name: 'city',
    value: (person) =>
      person.city && (
        <Placename
          name={person.city.name}
          traditionalName={person.city.traditionalName || undefined}
        />
      ),
  },
  {
    name: 'country',
    value: (person) =>
      person.country && (
        <Placename
          name={person.country.name}
          traditionalName={person.country.traditionalName || undefined}
        />
      ),
  },
];

type State = { [key in (typeof FIELDS)[number]['name']]: string | null };
type Action =
  | {
      type: 'set';
      field: keyof PersonDetailsFragment;
      id: PersonDetailsFragment['id'] | null;
    }
  | { type: 'reset' };

const MergeDialog: React.FC<MergeDialogProps> = ({ open, people: peopleProp, onOpenChange }) => {
  const people = useMemo<[PersonDetailsFragment, PersonDetailsFragment] | null>(
    () =>
      peopleProp.length === 2
        ? (peopleProp as [PersonDetailsFragment, PersonDetailsFragment])
        : null,
    [peopleProp]
  );

  const mostComplete = useMemo(
    () =>
      (people &&
        maxBy(
          people,
          (person) =>
            FIELDS.map((field) => person[field.name as keyof PersonDetailsFragment]).filter(
              (value) => !!value
            ).length
        )?.id) ||
      null,
    [people]
  );

  const [choices, dispatch] = useReducer(
    (state: State, action: Action) => {
      switch (action.type) {
        case 'set':
          return { ...state, [action.field]: action.id };
        case 'reset':
          return FIELDS.reduce(
            (state, field) => ({ ...state, [field.name]: mostComplete }),
            {} as State
          );
      }
      return state;
    },
    {} as State,
    () =>
      FIELDS.reduce(
        (state, field) => ({ ...state, [field.name]: people?.[0]?.id ?? null }),
        {} as State
      )
  );

  useEffect(() => dispatch({ type: 'reset' }), [mostComplete]);

  const [mergeProfiles] = useMergeProfilesMutation();

  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!people) return;
    setSaving(true);
    await mergeProfiles({
      variables: {
        profileIds: map(people, 'id'),
        attributes: choices,
      },
      update: (cache, { data }) => {
        if (!data?.mergeProfiles?.profile) return;
        const { profile } = data.mergeProfiles;
        const oldIds = new Set(map(people, 'id'));
        cache.updateQuery({ query: PeopleDocument }, (data) => ({
          ...data,
          people: [...data.people.filter((p: PersonDetailsFragment) => !oldIds.has(p.id)), profile],
        }));
      },
    });
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog className="merge-people" open={open && !!people} onOpenChange={onOpenChange}>
      <Dialog.Header>
        <Dialog.Title>Merge people</Dialog.Title>
        <Dialog.Close />
      </Dialog.Header>
      <Dialog.Body>
        {people && (
          <div className="merge-columns" aria-busy={saving || undefined}>
            {FIELDS.map((field) =>
              people.map((person, i) => (
                <Fragment key={person.id}>
                  {i > 0 && <Icon name="chevronRight" />}
                  <div
                    className="merge-column"
                    data-field={field}
                    data-id={person.id}
                    role="button"
                    aria-selected={choices[field.name] === person.id}
                    onClick={() => dispatch({ type: 'set', field: field.name, id: person.id })}
                  >
                    <small>{field.label ?? startCase(field.name)}</small>
                    {(field.value
                      ? field.value(person)
                      : (person[field.name] as string | null)) || (
                      <div className="merge-column__empty">(no value)</div>
                    )}
                  </div>
                </Fragment>
              ))
            )}
          </div>
        )}
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.Close text="Cancel" icon={undefined} />
        <Button primary text="Merge" onClick={handleSubmit} />
      </Dialog.Footer>
    </Dialog>
  );
};

export default MergeDialog;
