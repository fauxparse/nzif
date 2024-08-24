import { graphql } from '@/graphql';

export const WorkshopAllocationSessionDetailsFragment = graphql(`
  fragment WorkshopAllocationSessionDetails on WorkshopAllocationSession @_unmask {
    id
    capacity
    workshop {
      id
      name
    }
    registrations {
      id
    }
    waitlist {
      id
    }
    slots {
      id
      startsAt
      endsAt
    }
  }
`);

export const WorkshopAllocationSlotDetailsFragment = graphql(
  `
  fragment WorkshopAllocationSlotDetails on WorkshopAllocationSlot @_unmask {
    id
    startsAt
    sessions {
      ...WorkshopAllocationSessionDetails
    }
  }
`,
  [WorkshopAllocationSessionDetailsFragment]
);

export const WorkshopAllocationDetailsFragment = graphql(
  `
  fragment WorkshopAllocationDetails on WorkshopAllocation @_unmask {
    id
    state
    slots {
      ...WorkshopAllocationSlotDetails
    }
  }
`,
  [WorkshopAllocationSlotDetailsFragment]
);

export const WorkshopAllocationRegistrationFragment = graphql(`
  fragment WorkshopAllocationRegistration on Registration @_unmask {
    id

    user {
      id
      name
    }

    preferences {
      id
      position
      workshop {
        id
      }
      sessionId
    }
  }
`);

export const WorkshopAllocationQuery = graphql(
  `
  query WorkshopAllocation {
    festival {
      id

      workshopAllocation {
        ...WorkshopAllocationDetails
      }

      registrations {
        ...WorkshopAllocationRegistration
      }
    }
  }
`,
  [WorkshopAllocationDetailsFragment, WorkshopAllocationRegistrationFragment]
);
