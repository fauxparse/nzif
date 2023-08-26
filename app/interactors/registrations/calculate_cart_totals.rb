module Registrations
  class CalculateCartTotals < ApplicationInteractor
    delegate :registration, to: :context

    delegate :to_param, to: :registration

    def call
      authorize! registration, to: :view?
      context[:outstanding] = total - paid
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
          registration.requested_slots.count
        else
          registration.sessions.count
        end
    end

    def total
      context[:total] ||= value - discount
    end

    def paid
      context[:paid] ||= Money.new(0)
    end
  end
end
