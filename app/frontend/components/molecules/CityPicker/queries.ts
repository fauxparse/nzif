import { graphql } from '@/graphql';

export const CitiesQuery = graphql(`
  query Cities {
    cities {
      id
      name
      traditionalNames
      country
    }
  }
`);
