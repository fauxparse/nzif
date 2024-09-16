import { graphql } from '@/graphql';

export const DashboardQuery = graphql(`
  query DashboardQuery {
    dashboard {
      registrations {
        current
        max
      }

      workshopPlaces {
        current
        max
      }

      income {
        current
        max
      }
    }
  }
`);
