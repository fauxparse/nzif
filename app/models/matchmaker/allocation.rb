module Matchmaker
  class Allocation
    attr_accessor :festival, :seed, :capacity

    def self.process(festival:, seed: Random.new_seed, capacity: nil)
      new.process(festival:, seed:, capacity:)
    end

    def process(festival: nil, seed: Random.new_seed, capacity: nil)
      @festival = festival
      @seed = seed
      @capacity = capacity

      @retries = 10

      while (candidate = next_candidate)
        candidate.place(sessions) do |bumped|
          candidates.unshift(bumped) if bumped.present?
        end

        retry! if candidates.empty?
      end
      self
    end

    def retry!
      return if @retries.zero?

      @retries -= 1
      @candidates = registrations
        .select { |r| r.score < 0.5 }
        .flat_map { |r| r.candidates(reload: true) }
        .shuffle(random:)
    end

    def random
      @random ||= Random.new(seed)
    end

    def registrations
      @registrations ||= festival.registrations.completed.includes(:profile, preferences: :slot)
        .map { |r| Registration.new(r) }
    end

    def candidates
      @candidates ||= registrations.flat_map(&:candidates).shuffle(random:)
    end

    def next_candidate
      candidates.shift
    end

    def sessions
      @sessions ||= festival.sessions.includes(:slot, :activity)
        .where(activity_type: 'Workshop')
        .where.not(activity_id: nil)
        .map { |s| Session.new(s, capacity: capacity || s.capacity) }
        .index_by(&:id)
    end

    def siblings(session)
      sessions.values.select { |s| s.starts_at == session.starts_at }
    end

    def score
      average_score / never_bummed_out * no_zeroes
    end

    def average_score
      return 0 if registrations.empty?

      registrations.sum(&:score) / registrations.size.to_f
    end

    def never_bummed_out
      return 0 if registrations.empty?

      registrations.count { |r| r.bummed_out.zero? } / registrations.size.to_f
    end

    def no_zeroes
      registrations.any? { |r| r.score.zero? } ? 0 : 1
    end

    def as_json(*)
      {
        sessions: sessions.values.map(&:as_json),
        festival_id: festival.to_param,
        capacity:,
        seed:,
      }
    end

    def save_as(record)
      record.update!(
        score: score * 100_00,
        original: as_json,
        completed_at: Time.zone.now,
      )
    end

    def self.dump(value)
      (value || {}).to_json
    end

    def self.load(json) # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
      return nil if json.blank?

      data = JSON.parse(json).deep_symbolize_keys

      new.tap do |a|
        a.festival = Festival.find(data[:festival_id])
        a.seed = data[:seed]
        a.capacity = data[:capacity]

        registrations = a.registrations.index_by(&:id)

        data[:sessions].each do |s|
          session = a.sessions[s[:id]]
          s[:registrations].each do |r|
            registration = registrations[r]
            registration.slots[session.slot] = registration.session_position(session)
            session.candidates << registration.candidate(session)
          end
          s[:waitlist].each do |r|
            session.waitlist << registrations[r].candidate(session)
          end
        end
      end
    end

    def inspect
      '(Allocation)'
    end
  end
end
