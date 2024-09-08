import { graphql } from '@/graphql';

export const PaymentsRowFragment = graphql(`
  fragment PaymentsRow on Payment @_unmask {
    id
    amount
    state
    reference
    createdAt

    registration {
      id
      user {
        id
        name
      }
    }
  }
`);

export const PaymentsQuery = graphql(
  `
  query Payments {
    festival {
      id
      payments {
        ...PaymentsRow
      }
    }
  }
`,
  [PaymentsRowFragment]
);
