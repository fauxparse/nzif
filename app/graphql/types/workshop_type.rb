module Types
  class WorkshopType < Types::BaseActivity
    implements Types::ActivityType

    def presenters
      tutors
    end
  end
end
