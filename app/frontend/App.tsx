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
