module Sources
  class VenuesByFestival < BaseSource
    attr_reader :type

    def fetch(festival_ids)
      records = Venue.order(position: :asc).all
      festival_ids.map { records }
    end
  end
end
