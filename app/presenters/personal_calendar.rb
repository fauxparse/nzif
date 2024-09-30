class PersonalCalendar
  include Rails.application.routes.url_helpers

  attr_reader :festival, :user, :registration

  def initialize(festival:, user:)
    @festival = festival
    @user = user
    @registration =
      user && festival.registrations
        .includes(:feedback, sessions: %i[activity venue], waitlist: :session)
        .find_by(user:)
    @feedback = registration&.feedback&.index_by(&:session_id) || {}
  end

  def sessions
    @sessions ||= all_sessions.sort_by { |session| session.session.starts_at }
  end

  def to_ical
    Icalendar::Calendar.new.tap do |ical|
      ical.x_wr_calname = "#{user.name}’s NZIF Calendar"

      all_sessions.each do |session|
        next if session.hidden || session.waitlisted

        add_session(ical:, session: session.session)
      end

      ical.publish
    end.to_ical
  end

  private

  def festival_sessions
    @festival_sessions ||=
      festival
        .sessions
        .includes(cast: :profile, activity: { cast: :profile })
        .joins(
          <<~SQL.squish,
            LEFT OUTER JOIN hidden_sessions
            ON hidden_sessions.session_id = sessions.id
            AND hidden_sessions.user_id = #{user.id}
          SQL
        )
        .select('sessions.*, (hidden_sessions.id IS NOT NULL) AS hidden')
        .all
  end

  def all_sessions
    (shows + social_events + conferences + registered_workshops + teaching_workshops)
  end

  def wrap(sessions, waitlisted: false)
    sessions.select(&:activity_id?).map do |session|
      Hashie::Mash.new(
        session:,
        hidden: session.respond_to?(:hidden) ? session.hidden : false,
        waitlisted:,
        feedback: @feedback[session.id],
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

  def teaching_workshops
    teaching_sessions = festival_sessions.select do |session|
      session.workshop? &&
        [*session.cast, *session.activity.cast].any? { |c| c.profile.user_id == user.id }
    end
    wrap(teaching_sessions)
  end

  def add_session(ical:, session:, status: 'CONFIRMED') # rubocop:disable Metrics/MethodLength
    ical.event do |e|
      e.uid         = session.to_param
      e.dtstart     = session.starts_at.to_datetime
      e.dtend       = session.ends_at.to_datetime
      e.summary     = session.activity.name
      e.description = session.activity.description
      e.url         = workshop_url(session.activity.slug, host: 'my.improvfest.nz')
      e.organizer   = organizer
      e.attendee    = attendee
      e.location    = session.venue&.full_address_including_room
      e.status      = status
      e.sequence    = registration.snapshots.count
      e.ip_class    = 'PUBLIC'
      e.image       = session.activity.picture(:medium)&.url

      e.alarm do |a|
        a.action      = 'DISPLAY' # This line isn't necessary, it's the default
        a.summary     = "Workshop reminder: #{session.activity.name}"
        a.description = a.summary
        a.trigger     = '-PT15M' # 15 minutes before
      end
    end
  end

  def attendee
    Icalendar::Values::CalAddress.new(
      "mailto:#{user.email}",
      cn: user.name,
      partstat: 'accepted',
    )
  end

  def organizer
    Icalendar::Values::CalAddress.new('mailto:registrations@improvfest.nz', cn: 'NZIF')
  end
end
