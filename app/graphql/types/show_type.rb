module Types
  class ShowType < Types::BaseActivity
    implements Types::ActivityType

    description 'A show'

    def presenters
      directors
    end
  end
end
