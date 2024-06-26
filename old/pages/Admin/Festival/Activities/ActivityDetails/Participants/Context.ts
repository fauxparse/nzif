import { createContext, useContext } from 'react';

import { AdminActivitySessionDetailsFragment } from '@/graphql/types';

type ParticipantsContext = {
  session: AdminActivitySessionDetailsFragment;
};

const ParticipantsContext = createContext<ParticipantsContext>({} as ParticipantsContext);

export const useParticipantsContext = () => useContext(ParticipantsContext);

export default ParticipantsContext;
