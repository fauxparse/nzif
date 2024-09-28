module Registrations
  class CalculateCartTotals < ApplicationInteractor
    delegate :registration, to: :context

    delegate :to_param, to: :registration

    def call
      authorize! registration, to: :view?
      base_workshop_price
      context[:outstanding] = [0, total - paid].max
    end

    def base_workshop_price
      context[:base_workshop_price] ||= Registration.pricing.base_workshop_price
    end

    def value
      context[:value] ||= Registration.pricing.package_value(workshops: count)
    end

    def discount
      context[:discount] ||= Registration.pricing.package_discount(workshops: count)
    end

    def count
      context[:workshops_count] ||=
        if %i[earlybird paused].include? registration.festival.registration_phase
          registration.requested_slots.count('DISTINCT session_slots.starts_at')
        else
          registration.sessions.reduce(0) do |sum, session|
            sum + session.session_slots.count
          end
        end
    end

    def total
      context[:total] ||= value - discount
    end

    def paid
      context[:paid] ||= payments.sum(Money.new(0), &:amount)
    end

    def payments
      context[:payments] ||= registration.payments.where(state: %i[pending approved])
    end
  end
end
