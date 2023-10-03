module Sources
  class FeedbackByRegistration < BaseSource
    def fetch(registration_ids)
      records = Feedback.where(registration_id: registration_ids)
        .includes(:registration, session: :activity)
        .group_by(&:registration_id)
      registration_ids.map { |id| records[id] || [] }
    end
  end
end
