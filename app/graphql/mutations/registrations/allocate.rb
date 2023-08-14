module Mutations
  module Registrations
    class Allocate < BaseMutation
      graphql_name 'allocateWorkshops'

      field :workshop_allocation, Types::WorkshopAllocationType, null: false

      def resolve
        authorize!(Registration, to: :manage?)

        workshop_allocation = Allocation.create!(festival: current_festival).tap do |allocation|
          AllocateWorkshopsJob.perform_later(id: allocation.to_param)
        end

        { workshop_allocation: }
      end
    end
  end
end
