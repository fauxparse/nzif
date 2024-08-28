import { graphql } from '@/graphql';

export const DonationsRowFragment = graphql(`
  fragment DonationsRow on Donation @_unmask {
    id
    name
    anonymous
    amount
    message
    createdAt
  }
`);

export const DonationsQuery = graphql(
  `
  query Donations {
    donations {
      ...DonationsRow
    }
  }
`,
  [DonationsRowFragment]
);
