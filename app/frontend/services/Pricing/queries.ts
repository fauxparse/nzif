import { graphql } from '@/graphql';

export const PricingQuery = graphql(`
  query WorkshopPricing {
    festival {
      id
      workshopPricing {
        id
        baseWorkshopPrice
        discountPerAdditionalWorkshop
        discountLimit
      }
    }
  }
`);
