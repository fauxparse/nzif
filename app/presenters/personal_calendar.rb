class PersonalCalendar
  attr_reader :festival, :user, :registration

  def initialize(festival:, user:)
    @festival = festival
    @user = user
    @registration =
      user && festival.registrations
        .includes(:sessions, waitlist: :session)
        .find_by(user:)
  end

  def sessions
    @sessions ||= all_sessions.sort_by { |session| session.session.starts_at }
  end

  private

  def festival_sessions
    @festival_sessions ||=
      festival
        .sessions
        .joins(
          <<~SQL.squish,
            LEFT OUTER JOIN hidden_sessions
            ON hidden_sessions.session_id = sessions.id
          SQL
        )
        .where(hidden_sessions: { user_id: [nil, user.id] })
        .select('sessions.*, (hidden_sessions.id IS NOT NULL) AS hidden')
        .all
  end

  def all_sessions
    (shows + social_events + conferences + registered_workshops)
  end

  def wrap(sessions, waitlisted: false)
    sessions.select(&:activity_id?).map do |session|
      Hashie::Mash.new(
        session:,
        hidden: session.respond_to?(:hidden) ? session.hidden : false,
        waitlisted:,
      )
    end
  end

  def shows
    wrap(festival_sessions.select(&:show?))
  end

  def social_events
    wrap(festival_sessions.select(&:social_event?))
  end

  def conferences
    wrap(festival_sessions.select(&:conference?))
  end

  def registered_workshops
    return [] unless registration

    wrap(registration.sessions) + wrap(registration.waitlist.map(&:session), waitlisted: true)
  end
end
