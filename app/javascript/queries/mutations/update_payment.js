import gql from 'graphql-tag'

export default gql`
  mutation UpdatePayment($id: ID!, $attributes: PaymentAttributes!) {
    updatePayment(id: $id, attributes: $attributes) {
      id
      type
      amount
      state
      createdAt
      reference
      description
      registration {
        id
        user {
          id
          name
        }
      }
    }
  }
`
