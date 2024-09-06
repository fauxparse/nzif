module Matchmaker
  class Allocation
    attr_reader :registrations, :sessions

    def initialize(json)
      @registrations = json[:registrations].map do |r|
        Registration.new(allocation: self, **r.symbolize_keys)
      end.index_by(&:id)
      @sessions = json[:sessions].map do |s|
        Session.new(allocation: self, **s.symbolize_keys)
      end.index_by(&:id)
    end

    def allocate!
      @retries = 5

      while candidates.any?
        candidate = candidates.shift
        session = candidate.next_session

        next unless session

        session.place(candidate.registration) do |bumped|
          candidates.unshift(*bumped)
        end

        # repechage if candidates.empty?
      end

      self
    end

    def candidates
      @candidates ||= begin
        a, b = registrations.values
          .flat_map { |r| r.candidates.values }
          .partition { |c| c.preferences.key?(1) }
          .map(&:shuffle)
        a + b
      end
    end

    def score
      registrations.values.sum { |r| r.score * r.score } / [registrations.size, 1].max
    end

    def inspect
      '<Matchmaker::Allocation...>'
    end

    def self.from_festival(festival)
      new(**Loader.new(festival).as_json)
    end

    def self.dump(allocation)
      {
        registrations: allocation.registrations.values.map(&:as_json),
        sessions: allocation.sessions.values.map(&:as_json),
      }
    end

    def self.load(json)
      return nil if json.blank?

      new(**json.with_indifferent_access)
    end
  end
end
