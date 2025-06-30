import { graphql } from '../../../graphql';

export const CastMemberFragment = graphql(`
  fragment CastMember on Person @_unmask {
    id
    name
    pronouns
  }
`);

export const ShowCastQuery = graphql(
  `
  query ShowCast($slug: String!, $sessionId: ID!) {
    festival {
      id

      activity(type: Show, slug: $slug) {
        id

        ... on Show {
          id

          session(id: $sessionId) {
            hosts {
              ...CastMember
            }

            performers {
              ...CastMember
            }

            musos {
              ...CastMember
            }

            operators {
              ...CastMember
            }
          }
        }
      }
    }
  }
`,
  [CastMemberFragment]
);
