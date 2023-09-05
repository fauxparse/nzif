module Matchmaker
  class Allocation
    attr_reader :registrations, :sessions

    def initialize(json)
      @registrations = json[:registrations].map do |r|
        Registration.new(**r.symbolize_keys)
      end.index_by(&:id)
      @sessions = json[:sessions].map do |s|
        Session.new(registrations:, **s.symbolize_keys)
      end.index_by(&:id)
    end

    def allocate!
      @retries = 5

      while candidates.any?
        candidate = candidates.shift

        session = candidate.next_non_clashing_session(sessions)
        next unless session

        session.place(candidate.registration) do |bumped|
          candidates.unshift(bumped)
        end

        repechage if candidates.empty?
      end
      self
    end

    def repechage
      return if @retries.zero?

      @retries -= 1
      @candidates = registrations.values.select(&:zero?).flat_map do |c|
        c.candidates(reload: true).values
      end.shuffle
    end

    def candidates
      @candidates ||= registrations.values.flat_map { |r| r.candidates.values }.shuffle
    end

    def score
      registrations.values.sum { |r| r.score * r.score } / [registrations.size, 1].max
    end

    def siblings(session)
      sessions.values.select { |s| s.starts_at == session.starts_at }
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
