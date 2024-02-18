import { useCallback, useState } from 'react';

import Button from '@/atoms/Button';
import {
  AdminActivitySessionDetailsFragment,
  ParticipantRegistrationFragment,
  useParticipantSearchLazyQuery,
} from '@/graphql/types';
import Search from '@/molecules/Search';
import { SearchResult } from '@/molecules/Search/Search.types';
import Dialog from '@/organisms/Dialog';

import useParticipants from './useParticipants';

type ParticipantSearchProps = {
  session: AdminActivitySessionDetailsFragment;
};

const ParticipantSearch: React.FC<ParticipantSearchProps> = ({ session }) => {
  const { add, remove, promote, demote, addToWaitlist, removeFromWaitlist } =
    useParticipants(session);

  const [search, { data }] = useParticipantSearchLazyQuery();

  const [registration, setRegistration] = useState<ParticipantRegistrationFragment | null>(null);

  const measure = (el: HTMLElement) => {
    const parent = el.parentElement;
    if (!parent) return { left: 0, right: 0 };

    const { right } = el.getBoundingClientRect();
    const parentRight = parent.getBoundingClientRect().right;

    return {
      left: -el.offsetLeft,
      right: right - parentRight,
    };
  };

  const inSession = useCallback(
    (registration: ParticipantRegistrationFragment) =>
      session.participants.some((p) => p.id === registration.id),
    [session]
  );

  const onWaitlist = useCallback(
    (registration: ParticipantRegistrationFragment) =>
      session.waitlist.some((p) => p.registration.id === registration.id),
    [session]
  );

  const performSearch = useCallback(
    (query: string) =>
      new Promise<SearchResult[]>((resolve) =>
        search({ variables: { name: query } }).then(({ data }) =>
          resolve(
            data?.festival?.registrations?.map((result) => {
              const searchResult: SearchResult = {
                id: result.id,
                title: result.user?.profile?.name || '',
                description: inSession(result)
                  ? 'Already in session'
                  : onWaitlist(result)
                    ? 'On the waitlist'
                    : 'Not in this session',
                icon: 'user',
                url: '',
              };
              return searchResult;
            }) || []
          )
        )
      ),
    [search, inSession, onWaitlist]
  );

  const resultClicked = (result: SearchResult) => {
    const registration = data?.festival?.registrations?.find((r) => r.id === result.id) || null;

    setRegistration(registration);
  };

  const action = (mutation: (registration: ParticipantRegistrationFragment) => void) => () => {
    if (!registration) return;
    mutation(registration);
    setRegistration(null);
  };

  return (
    <>
      <Search onMeasure={measure} onSearch={performSearch} onResultClick={resultClicked} />
      <Dialog
        className="session-participant-confirmation"
        open={!!registration}
        onOpenChange={(isOpen) => setRegistration((current) => (isOpen ? current : null))}
      >
        <Dialog.Header>
          <Dialog.Title>{registration?.user?.profile?.name}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          {registration && (
            <p>
              This person is currently{' '}
              {inSession(registration)
                ? 'in'
                : onWaitlist(registration)
                  ? 'on the waitlist for'
                  : 'not in'}{' '}
              this session.
            </p>
          )}
        </Dialog.Body>
        {registration && (
          <Dialog.Footer>
            {inSession(registration) ? (
              <>
                <Button text="Remove them" onClick={action(remove)} />
                <Button text="Move to waitlist" onClick={action(demote)} />
              </>
            ) : onWaitlist(registration) ? (
              <>
                <Button text="Add to session" onClick={action(promote)} />
                <Button text="Remove from waitlist" onClick={action(removeFromWaitlist)} />
              </>
            ) : (
              <>
                <Button text="Add to session" onClick={action(add)} />
                <Button text="Add to waitlist" onClick={action(addToWaitlist)} />
              </>
            )}
          </Dialog.Footer>
        )}
      </Dialog>
    </>
  );
};

export default ParticipantSearch;
