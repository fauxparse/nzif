module Sources
  class FeedbackByWorkshop < BaseSource
    def fetch(workshop_ids)
      records = Feedback
        .joins(:session)
        .where(session: { activity_id: workshop_ids })
        .includes(:session)
        .group_by { |feedback| feedback.session.activity_id }
      workshop_ids.map { |id| records[id] || [] }
    end
  end
end
