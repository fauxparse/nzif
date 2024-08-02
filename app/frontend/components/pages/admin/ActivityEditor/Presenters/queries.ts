import { graphql } from '@/graphql';

export const PickablePersonFragment = graphql(`
  fragment PickablePerson on Person @_unmask {
    id
    name
  }
`);

export const PersonSearchQuery = graphql(
  `
  query PersonSearch($query: String!) {
    search(query: $query, only: Person) {
      ...on PersonResult {
        person {
          ...PickablePerson
        }
      }
    }
  }
  `,
  [PickablePersonFragment]
);

export const AddPersonMutation = graphql(
  `
    mutation AddPerson($name: String!) {
      createPerson(attributes: { name: $name }) {
        profile {
          ...PickablePerson
        }
      }
    }
  `,
  [PickablePersonFragment]
);
