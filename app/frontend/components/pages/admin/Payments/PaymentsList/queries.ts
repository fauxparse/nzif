import { graphql } from '@/graphql';

export const PaymentsRowFragment = graphql(`
  fragment PaymentsRow on Payment @_unmask {
    id
    type
    amount
    state
    reference
    createdAt

    registration {
      id
      donateDiscount
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

export const UpdatePaymentStateMutation = graphql(
  `
  mutation UpdatePaymentState($id: ID!, $state: PaymentState!) {
    updatePayment(id: $id, attributes: { state: $state }) {
      payment {
        ...PaymentsRow
      }
    }
  }
`,
  [PaymentsRowFragment]
);
