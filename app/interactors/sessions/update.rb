module Sessions
  class Update < ApplicationInteractor
    delegate :session, :attributes, to: :context

    def call
      authorize! session, to: :update?

      session.transaction do
        session.update!(attributes)
      end
    end

    private

    def attributes
      @attributes ||= context[:attributes].to_h.tap do |attributes|
        if attributes.key?(:venue_id)
          venue_id = attributes.delete(:venue_id)
          attributes[:venue_id] = Venue.decode_id(venue_id) || venue_id
          remove_venue_clashes(attributes[:venue_id])
        end
        if attributes.key?(:activity_id)
          activity_id = attributes.delete(:activity_id)
          attributes[:activity_id] = Activity.decode_id(activity_id) || activity_id
        end
      end
    end

    def remove_venue_clashes(venue_id)
      session.slot.sessions.where(venue_id:).where.not(id: session.id).each do |s|
        s.update!(venue_id: nil)
      end
    end
  end
end
