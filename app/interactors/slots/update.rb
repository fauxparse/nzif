module Slots
  class Update < ApplicationInteractor
    delegate :slot, :attributes, to: :context

    def call
      authorize! slot, to: :update?

      slot.update!(attributes)
    end

    private

    def attributes
      @attributes ||= context[:attributes].to_h.tap do |attributes|
        if attributes.key?(:venue_id)
          venue_id = attributes.delete(:venue_id)
          attributes[:venue_id] = Venue.decode_id(venue_id) || venue_id
        end
        if attributes.key?(:activity_id)
          activity_id = attributes.delete(:activity_id)
          attributes[:activity_id] = Activity.decode_id(activity_id) || activity_id
        end
      end
    end
  end
end
