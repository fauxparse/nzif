module Types
  class SocialEventType < Types::BaseActivity
    implements Types::ActivityType

    description 'A social event'

    def presenters
      organisers
    end
  end
end
