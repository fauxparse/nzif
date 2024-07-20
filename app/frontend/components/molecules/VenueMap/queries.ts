import { graphql } from '@/graphql';

export const MapVenueFragment = graphql(`
  fragment MapVenue on Venue @_unmask {
    id
    room
    building
    address
    latitude
    longitude
  }
`);

export const MapVenuesQuery = graphql(
  `
  query MapVenues {
    festival {
      id

      venues {
        ...MapVenue
      }
    }
  }
`,
  [MapVenueFragment]
);
