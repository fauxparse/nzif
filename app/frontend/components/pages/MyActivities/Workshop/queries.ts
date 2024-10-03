import { CastMemberFragment } from '@/components/organisms/ShowCast/queries';
import { graphql } from '@/graphql';

export const MessageFragment = graphql(`
  fragment Message on Message @_unmask {
    id
    createdAt
    subject
    content

    sender {
      id
      profile {
        id
        name
        picture {
          id
          medium
        }
      }
    }
  }
`);

export const MyWorkshopSessionQuery = graphql(
  `
  query MyWorkshopSession($sessionId: ID!) {
    session(id: $sessionId) {
      id
      startsAt
      endsAt
      capacity

      activity {
        id
        name

        ...on Workshop {
          show {
            id

            sessions {
              id
              performers {
                ...CastMember
              }
            }
          }
        }
      }

      venue {
        id
        room
        building
      }

      participants {
        id
        user {
          id
          profile {
            id
            name
            pronouns

            picture {
              id
              medium
            }

            city {
              id
              name
              traditionalNames
              country
            }
          }
        }
      }

      waitlist {
        id
      }

      messages {
        ...Message
      }
    }
  }
`,
  [MessageFragment, CastMemberFragment]
);

export const SendMessageMutation = graphql(
  `
  mutation SendMessage($sessionId: ID!, $subject: String!, $content: String!) {
    sendMessage(sessionId: $sessionId, subject: $subject, content: $content) {
      message {
        ...Message
      }
    }
  }
  `,
  [MessageFragment]
);

export const AddCastMemberMutation = graphql(
  `
  mutation AddCastMember($profileId: ID!, $sessionId: ID!) {
    addSessionCast(sessionId: $sessionId, profileId: $profileId, role: performer) {
      cast {
        ...CastMember
      }
    }
  }
`,
  [CastMemberFragment]
);

export const RemoveCastMemberMutation = graphql(
  `
  mutation RemoveCastMember($profileId: ID!, $sessionId: ID!) {
    removeSessionCast(sessionId: $sessionId, profileId: $profileId, role: performer)
  }
`
);
