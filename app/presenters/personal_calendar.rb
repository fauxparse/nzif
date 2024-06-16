class PersonalCalendar
  attr_reader :festival, :registration

  def initialize(festival:, user:)
    @festival = festival
    @registration = user && festival.registrations.includes(:sessions,
      waitlist: :session).find_by(user:)
  end

  def sessions
    @sessions ||= all_sessions.sort_by { |session| session.session.starts_at }
  end

  private

  def all_sessions
    (shows + social_events + conferences + registered_workshops)
  end

  def wrap(sessions, hidden: false, waitlisted: false)
    sessions.select(&:activity_id?).map do |session|
      Hashie::Mash.new(
        session:,
        hidden:,
        waitlisted:,
      )
    end
  end

  def shows
    wrap(festival.sessions.select(&:show?))
  end

  def social_events
    wrap(festival.sessions.select(&:social_event?))
  end

  def conferences
    wrap(festival.sessions.select(&:conference?))
  end

  def registered_workshops
    return [] unless registration

    wrap(registration.sessions) + wrap(registration.waitlist.map(&:session), waitlisted: true)
  end
end
