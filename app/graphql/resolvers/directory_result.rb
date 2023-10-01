module Resolvers
  class DirectoryResult < Resolvers::BaseResolver
    type Types::SessionType, null: false

    argument :id, GraphQL::Types::ID, required: true
    argument :time, GraphQL::Types::ISO8601DateTime, required: true

    def resolve(id:, time:)
      attending(id:, time:) || teaching(id:, time:)
    end

    private

    def attending(id:, time:)
      Session
        .joins(:activity, placements: { registration: { user: :profile } })
        .find_by(profiles: { id: Profile.decode_id(id) }, starts_at: time)
    end

    def teaching(id:, time:)
      Session
        .joins(activity: { cast: :profile })
        .find_by(profiles: { id: Profile.decode_id(id) }, starts_at: time)
    end
  end
end
