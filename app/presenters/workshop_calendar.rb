require 'icalendar/tzinfo'

class WorkshopCalendar
  include Rails.application.routes.url_helpers

  attr_reader :registration, :sessions

  def initialize(registration, sessions: nil, deleted_sessions: [])
    @registration = Registration.with_details_for_calendar.find(registration.id)
    @sessions = sessions ||= default_sessions

    # start_time = (sessions.first || deleted_sessions.first)&.starts_at
    # ical.add_timezone start_time.time_zone.tzinfo.ical_timezone(start_time) if start_time
    # deleted_sessions.each { |session| add_session(session, status: 'CANCELLED') }
    # sessions.each { |session| add_session(session) }
    # ical.append_custom_property('METHOD', 'PUBLISH')
  end

  delegate :user, to: :registration
  delegate :profile, to: :user
  delegate :name, :email, to: :profile
  delegate :to_ical, to: :ical

  def ical
    @ical ||= Icalendar::Calendar.new
  end

  def add_session(session, status: 'CONFIRMED') # rubocop:disable Metrics/MethodLength
    ical.add_timezone session.starts_at.time_zone.tzinfo.ical_timezone(session.starts_at)
    tzid = session.starts_at.time_zone.tzinfo.identifier

    ical.event do |e|
      e.uid         = session.to_param
      e.dtstart     = Icalendar::Values::DateTime.new(session.starts_at, tzid:)
      e.dtend       = Icalendar::Values::DateTime.new(session.ends_at, tzid:)
      e.summary     = session.activity.name
      e.description = session.activity.description
      e.url         = workshop_url(session.activity.slug, host: 'my.improvfest.nz')
      e.organizer   = organizer
      e.attendee    = attendee
      e.location    = session.venue&.full_address_including_room
      e.status      = status
      e.sequence    = registration.snapshots.count
      e.ip_class    = 'PUBLIC'

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
      cn: profile.name,
      partstat: 'accepted',
    )
  end

  def organizer
    Icalendar::Values::CalAddress.new('mailto:registrations@improvfest.nz', cn: 'NZIF')
  end

  def default_sessions
    registration.placements.map(&:session) + teaching_sessions
  end

  def teaching_sessions
    profile
      .cast
      .includes(activity: :sessions)
      .flat_map { |c| c.activity&.sessions || [] }
      .select { |s| s.festival_id == registration.festival_id }
  end
end
