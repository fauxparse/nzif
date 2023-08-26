module Sources
  class Payments < BaseSource
    attr_reader :states

    def initialize(context:, states: [])
      super(context:)
      @states = states.blank? ? nil : states.map(&:to_sym)
    end

    def fetch(registration_ids)
      records = Payment.where(registration_id: registration_ids).order(:created_at)
      records = records.where(state: states) if states.present?
      registration_ids.map { |id| records.select { |r| r.registration_id == id } }
    end
  end
end
