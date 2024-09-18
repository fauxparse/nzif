module Resolvers
  class Session < BaseResolver
    type Types::SessionType, null: false

    argument :id, ID, required: true

    def resolve(id:)
      ::Session.find(id).tap do |session|
        authorize! session, to: :cast?
      end
    end
  end
end
