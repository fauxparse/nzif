module Types
  class ConferenceType < Types::BaseActivity
    implements Types::ActivityType

    def presenters
      speakers
    end
  end
end
