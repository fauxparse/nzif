module Types
  class WorkshopType < Types::BaseActivity
    implements Types::ActivityType

    description 'A workshop'

    def presenters
      tutors
    end
  end
end
