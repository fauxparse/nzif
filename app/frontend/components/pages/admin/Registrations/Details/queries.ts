import { graphql } from '@/graphql';

export const RegistrationSessionFragment = graphql(`
  fragment RegistrationSession on Session @_unmask {
    id
    startsAt
    endsAt
    activity {
      id
      name
      slug
      type
    }
    slots {
      id
      startsAt
      endsAt
    }
  }
`);

export const RegistrationPaymentFragment = graphql(`
  fragment RegistrationPayment on Payment @_unmask {
    id
    amount
    createdAt
    type
    state
  }
`);

export const RegistrationDetailsFragment = graphql(
  `
  fragment RegistrationDetails on Registration @_unmask {
    id

    user {
      id
      name
      email
    }

    completedAt
    donateDiscount

    preferences {
      id
      position
      session {
        ...RegistrationSession
      }
    }

    sessions {
      ...RegistrationSession
    }

    payments {
      ...RegistrationPayment
    }
  }
`,
  [RegistrationSessionFragment, RegistrationPaymentFragment]
);

export const RegistrationDetailsQuery = graphql(
  `
  query RegistrationDetails($id: ID!) {
    registration(id: $id) {
      ...RegistrationDetails
    }
  }
`,
  [RegistrationDetailsFragment]
);

export const RemoveFromSessionMutation = graphql(
  `
  mutation RemoveFromSession($registrationId: ID!, $sessionId: ID!) {
    removeFromSession(registrationId: $registrationId, sessionId: $sessionId) {
      registration {
        id
        sessions {
          ...RegistrationSession
        }
      }
    }
  }
`,
  [RegistrationSessionFragment]
);

export const AddPaymentMutation = graphql(
  `
  mutation AddPayment($registrationId: ID!, $type: PaymentType!, $state: PaymentState!, $amount: Money!, $createdAt: ISO8601DateTime!) {
    addPayment(registrationId: $registrationId, type: $type, state: $state, amount: $amount, createdAt: $createdAt) {
      payment {
        ...RegistrationPayment
      }
    }
  }
`,
  [RegistrationPaymentFragment]
);
