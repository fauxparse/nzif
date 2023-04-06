import React from 'react';
import { gql } from '@apollo/client';

import { useTestQueryQuery } from './graphql/types';
import AuthenticationProvider from './organisms/Authentication/AuthenticationProvider';
import Header from './organisms/Header';

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

    user {
      id
      name
    }
  }
`;

const App: React.FC = () => {
  const { data } = useTestQueryQuery();

  // eslint-disable-next-line no-console
  console.log(data);

  return (
    <AuthenticationProvider>
      <div className="app">
        <Header />
      </div>
    </AuthenticationProvider>
  );
};

export default App;
