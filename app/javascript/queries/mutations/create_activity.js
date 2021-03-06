import gql from 'graphql-tag'

export default gql`
  mutation CreateActivity($year: ID!, $type: ActivityType!, $attributes: ActivityAttributes!) {
    createActivity(year: $year, type: $type, attributes: $attributes) {
      id
      name
      url
      type
    }
  }
`
