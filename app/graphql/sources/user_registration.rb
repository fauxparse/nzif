module Sources
  class UserRegistration < BaseSource
    attr_reader :festival

    def initialize(context:, festival:)
      super(context:)
      @festival = festival
    end

    def fetch(user_ids)
      records = festival.registrations.where(user_id: user_ids).index_by(&:user_id)
      user_ids.map { |id| records[id] }
    end
  end
end
