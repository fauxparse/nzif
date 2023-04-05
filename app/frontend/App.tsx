import React from 'react';
import { gql } from '@apollo/client';

import { useTestQueryQuery } from './graphql/types';
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

gql`
  mutation LogIn {
    userLogin(email: "fauxparse@gmail.com", password: "thecaptainnow") {
      authenticatable {
        id
        name
      }
    }
  }
`;

const App: React.FC = () => {
  const { data } = useTestQueryQuery();

  // eslint-disable-next-line no-console
  console.log(data);

  return (
    <div className="app">
      <Header />
    </div>
  );
};

export default App;
