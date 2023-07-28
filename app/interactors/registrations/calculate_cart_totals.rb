module Registrations
  class CalculateCartTotals < ApplicationInteractor
    delegate :registration, to: :context

    delegate :to_param, to: :registration

    def call
      authorize! registration, to: :view?
      context[:outstanding] = total - paid
    end

    def value
      context[:value] ||= count * Registration.pricing.base_workshop_price
    end

    def discount
      context[:discount] ||=
        ((count * (count - 1)) / 2) * Registration.pricing.discount_per_additional_workshop
    end

    def count
      context[:workshops_count] ||=
        if registration.festival.registration_phase == :earlybird
          registration.requested_slots.count
        else
          registration.workshops.count
        end
    end

    def total
      context[:total] ||= value - discount
    end

    def paid
      context[:paid] ||= 0
    end
  end
end
