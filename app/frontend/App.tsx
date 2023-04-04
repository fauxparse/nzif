import React from 'react';
import { gql } from '@apollo/client';
import { useTestQueryQuery } from './graphql/types';

gql`
  query TestQuery {
    festival(year: "2023") {
      id
      startDate
      endDate
      state

      activities(type: workshop) {
        id
        name
      }

      activity(type: show, slug: "the-history-boy") {
        id
        name
      }
    }
  }
`;

const App: React.FC = () => {
  const { data } = useTestQueryQuery();

  // eslint-disable-next-line no-console
  console.log(data?.festival);

  return (
    <div>
      <h1>NZIF</h1>
    </div>
  );
};

export default App;
