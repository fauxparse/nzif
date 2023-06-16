module Sessions
  class Create < ApplicationInteractor
    delegate :festival, :attributes, to: :context

    def call
      authorize! session, to: :create?

      session.update!(attributes)
    end

    def session
      context[:session] ||= festival.sessions.build
    end

    private

    def attributes
      @attributes ||= context[:attributes].to_h.tap do |attributes|
        if attributes.key?(:venue_id)
          venue_id = attributes.delete(:venue_id)
          attributes[:venue_id] = Venue.decode_id(venue_id) || venue_id
        end
      end
    end
  end
end
