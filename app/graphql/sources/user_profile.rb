module Sources
  class UserProfile < BaseSource
    attr_reader :festival, :type

    def fetch(user_ids)
      records = Profile.where(user_id: user_ids).index_by(&:user_id)
      user_ids.map { |id| records[id] }
    end
  end
end
