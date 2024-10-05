import { Combobox } from '@/components/molecules/Combobox';
import { CastMemberFragment } from '@/components/organisms/ShowCast/queries';
import { FragmentOf } from '@/graphql';
import { Role } from '@/graphql/types';
import TrashIcon from '@/icons/TrashIcon';
import { Reference, useLazyQuery, useMutation } from '@apollo/client';
import { Box, Card, Flex, IconButton, Text } from '@radix-ui/themes';
import { isEmpty, sortBy } from 'lodash-es';
import pluralize from 'pluralize';
import { useMemo } from 'react';
import {
  AddCastMutation,
  CreateCastMemberMutation,
  RemoveCastMutation,
  SearchPeopleQuery,
  WorkshopShowFragment,
} from './queries';

import { useToast } from '@/components/molecules/Toast';
import classes from './ActivityEditor.module.css';

type CastMember = FragmentOf<typeof CastMemberFragment>;

type WorkshopShow = FragmentOf<typeof WorkshopShowFragment>;
type Field = 'hosts' | 'performers' | 'musos' | 'operators';

const ROLES: { role: Role; name: string; field: Field }[] = [
  {
    role: Role.Host,
    name: 'Host',
    field: 'hosts',
  },
  {
    role: Role.Performer,
    name: 'Performer',
    field: 'performers',
  },
  {
    role: Role.Muso,
    name: 'Musician',
    field: 'musos',
  },
  {
    role: Role.Operator,
    name: 'Operator',
    field: 'operators',
  },
] as const;

type ShowProps = {
  show: FragmentOf<typeof WorkshopShowFragment>;
};

export const Show: React.FC<ShowProps> = ({ show }) => {
  return (
    <div className={classes.showCasting}>
      {ROLES.map(({ role, name, field }) => (
        <Section key={role} show={show.sessions[0]} role={role} name={name} field={field} />
      ))}
    </div>
  );
};

type SectionProps = {
  role: Role;
  name: string;
  field: Field;
  show: WorkshopShow['sessions'][number];
};

const Section: React.FC<SectionProps> = ({ role, name, field, show }) => {
  const existing = useMemo(() => sortBy(show[field] ?? [], 'name'), [show, field]);

  const { notify } = useToast();

  const [doSearch] = useLazyQuery(SearchPeopleQuery);

  const search = async (query: string) => {
    const { data } = await doSearch({ variables: { query } });
    return (
      data?.search
        .filter((p) => 'person' in p)
        .map(({ person: { id, name } }) => ({ id, label: name })) ?? []
    );
  };

  const [doAddCast] = useMutation(AddCastMutation);

  const [doRemoveCast] = useMutation(RemoveCastMutation);

  const [doCreate] = useMutation(CreateCastMemberMutation);

  const add = async (person: { id: string; label: string } | null) => {
    if (!person) return;
    doAddCast({
      variables: { sessionId: show.id, role, personId: person.id },
      optimisticResponse: {
        addSessionCast: {
          cast: {
            __typename: 'Person',
            id: person.id,
            name: person.label,
            pronouns: null,
          } as CastMember,
        },
      },
      update: (cache, { data }) => {
        const castMember = data?.addSessionCast?.cast;

        if (isEmpty(castMember)) return;
        const ref = cache.writeFragment({
          fragment: CastMemberFragment,
          data: castMember,
        });
        if (ref) {
          cache.modify({
            id: cache.identify(show),
            fields: {
              [field]: (existing: readonly Reference[]) => [...existing, ref],
            },
          });
        }
      },
    });
  };

  const remove = async (person: { id: string; label: string } | null) => {
    if (!person) return;
    doRemoveCast({
      variables: { sessionId: show.id, role, personId: person.id },
      optimisticResponse: {
        removeSessionCast: true,
      },
      update: (cache) => {
        cache.modify({
          id: cache.identify(show),
          fields: {
            [field]: (existing: readonly Reference[], { readField }) =>
              existing.filter((ref) => readField('id', ref) !== person.id),
          },
        });
      },
    });
  };

  const create = async (name: string) =>
    doCreate({
      variables: { name },
    })
      .catch((error) => {
        notify({ description: error.message });
        return null;
      })
      .then((result) => {
        const profile = result?.data?.createPerson?.profile;

        if (profile) return { id: profile.id, label: profile.name };
        return null;
      });

  return (
    <Box asChild maxWidth="24rem">
      <section>
        <h3>{pluralize(name, existing.length)}</h3>
        <Flex direction="column" gap="2">
          {existing.map((presenter) => (
            <Card key={presenter.id}>
              <Flex justify="between" align="center">
                <Text>{presenter.name}</Text>
                <IconButton
                  variant="ghost"
                  m="0"
                  onClick={() => remove({ id: presenter.id, label: presenter.name })}
                >
                  <TrashIcon />
                </IconButton>
              </Flex>
            </Card>
          ))}
          <Combobox.Root
            items={search}
            placeholder="Add…"
            enableAdd
            onSelect={add}
            onAdd={create}
          />
        </Flex>
      </section>
    </Box>
  );
};
