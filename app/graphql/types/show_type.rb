module Types
  class ShowType < Types::BaseActivity
    implements Types::ActivityType

    def presenters
      directors
    end
  end
end
