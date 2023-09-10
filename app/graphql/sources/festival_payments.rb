module Sources
  class FestivalPayments < BaseSource
    attr_reader :states

    def initialize(context:, states: [])
      super(context:)
      @states = states.blank? ? nil : states.map(&:to_sym)
    end

    def fetch(festival_ids)
      records = Payment.includes(:registration).references(:registrations)
        .where(festival_id: festival_ids)
        .order(created_at: :desc)
        .group_by { |p| p.registration.festival_id }
      festival_ids.map { |id| records[id] || [] }
    end
  end
end
