import { useMemo, useState } from 'react';
import { sortBy, upperFirst } from 'lodash-es';

import Avatar from '@/atoms/Avatar';
import Icon from '@/atoms/Icon';
import { ActivityType, CastingSessionFragment } from '@/graphql/types';
import usePresenters from '@/hooks/usePresenters';
import PersonPicker from '@/molecules/PersonPicker';
import { Profile } from '@/molecules/PersonPicker/PersonPicker.types';

import useCasting, { Person, Roles } from './useCasting';

type SectionProps = {
  role: Roles;
  session: CastingSessionFragment;
};

const Section: React.FC<SectionProps> = ({ session, role }) => {
  const { people, update, add } = useCasting(session, role);

  const { handleSearchPresenters, handleCreatePresenter } = usePresenters();

  const workshop = useMemo(() => {
    if (role !== 'performers' || session.activity?.type !== ActivityType.Show) return null;
    return ('workshop' in session.activity && session.activity.workshop) || null;
  }, [role, session]);

  const value = useMemo(() => people(role), [people, role]);

  const currentIds = useMemo(() => new Set(value.map((p) => p.id)), [value]);

  const workshopParticipants = useMemo(
    () =>
      sortBy(
        workshop?.sessions?.flatMap(
          (s) =>
            s.participants
              .map((p) => p.user?.profile)
              .filter((p) => !!p && !currentIds.has(p.id)) as Person[]
        ) || [],
        'name'
      ),
    [currentIds, workshop?.sessions]
  );

  const addWorkshopParticipant = (person: Profile) => {
    add(person);
  };

  return (
    <section>
      <h2>{upperFirst(role)}</h2>
      <PersonPicker
        value={value}
        onChange={update}
        onSearch={handleSearchPresenters}
        onCreate={handleCreatePresenter}
      />
      {workshopParticipants.length > 0 && (
        <details className="casting__workshop-participants">
          <summary>
            <Icon name="chevronRight" />
            <h3>
              Workshop participants <small>(click to add)</small>
            </h3>
          </summary>
          <div className="participants">
            {workshopParticipants.map((p) => (
              <button
                key={p.id}
                className="person-picker__person"
                onClick={() => addWorkshopParticipant(p)}
              >
                <Avatar name={p.name} />
                <div className="person-picker__name">{p.name}</div>
              </button>
            ))}
          </div>
        </details>
      )}
    </section>
  );
};

export default Section;
