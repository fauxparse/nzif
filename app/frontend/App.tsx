import React from 'react';
import { gql } from '@apollo/client';
import { useTestQueryQuery } from './graphql/types';

gql`
  query TestQuery {
    now
  }
`;

const App: React.FC = () => {
  const { data } = useTestQueryQuery();

  // eslint-disable-next-line no-console
  console.log(data?.now?.toJSON());

  return (
    <div>
      <h1>NZIF</h1>
    </div>
  );
};

export default App;
