import { graphql } from '@/graphql';

export const WorkshopAllocationSessionDetailsFragment = graphql(`
  fragment WorkshopAllocationSessionDetails on WorkshopAllocationSession @_unmask {
    id
    capacity
    startsAt
    endsAt
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

export const WorkshopAllocationDetailsFragment = graphql(
  `
  fragment WorkshopAllocationDetails on WorkshopAllocation @_unmask {
    id
    state
    sessions {
      ...WorkshopAllocationSessionDetails
    }
  }
`,
  [WorkshopAllocationSessionDetailsFragment]
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

export const MoveAllocatedParticipantMutation = graphql(
  `
  mutation MoveAllocatedParticipant(
    $registrationId: ID!
    $from: ID
    $to: ID
    $waitlist: Boolean
  ) {
    moveAllocatedParticipant(
      registrationId: $registrationId
      oldSessionId: $from
      newSessionId: $to
      waitlist: $waitlist
    ) {
      affectedSessions {
        ...WorkshopAllocationSessionDetails
      }
    }
  }
`,
  [WorkshopAllocationSessionDetailsFragment]
);

export const AllocateWorkshopsMutation = graphql(`
  mutation AllocateWorkshops {
    allocateWorkshops {
      workshopAllocation {
        id
        state
      }
    }
  }
`);

export const AllocationProgressSubscription = graphql(`
  subscription AllocationProgress($id: ID!) {
    jobProgress(jobName: "AllocateWorkshops", id: $id) {
      id
      state
      progress
      total
      error
    }
  }
`);
