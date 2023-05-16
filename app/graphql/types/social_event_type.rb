module Types
  class SocialEventType < Types::BaseActivity
    implements Types::ActivityType

    def presenters
      organisers
    end
  end
end
