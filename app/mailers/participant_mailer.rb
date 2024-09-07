class ParticipantMailer < ApplicationMailer
  def registration_confirmation(registration:)
    @user = registration.user
    @festival = registration.festival

    mail(
      to: email_address_with_name(@user.email, @user.profile.name),
      subject: "Your NZIF #{registration.festival.year} registration",
    )
  end

  def workshop_confirmation(registration:) # rubocop:disable Metrics/MethodLength
    @registration = Registration
      .includes(
        placements: { session: %i[activity venue session_slots] },
        preferences: [:slots, { session: %i[activity venue] }],
      )
      .find(registration.id)
    @user = registration.user
    @festival = registration.festival
    @placements = registration.placements
      .includes(session: %i[activity venue session_slots])
      .sort_by { |p| p.session.starts_at }
    slots = Set.new(@placements.flat_map { |p| p.session.session_slots[0].starts_at })
    @empty_slots = registration
      .preferences
      .reject { |p| slots.include?(p.slots.first.starts_at) }
      .sort_by { |p| p.session.starts_at }
      .map { |p| [p.slots[0].starts_at, p] }
      .group_by(&:first)
      .transform_values { |v| v.map(&:last) }

    @cart = Registrations::CalculateCartTotals.call(
      registration: @registration,
      current_user: @registration.user,
    )

    @removed = Registrations::CompareWorkshopLists.call(registration:).removed

    attachments['workshops.ics'] =
      WorkshopCalendar.new(registration, deleted_sessions: @removed).to_ical

    mail(
      to: email_address_with_name(@user.email, @user.profile.name),
      subject: "Your NZIF #{registration.festival.year} workshop schedule",
    )
  end

  def added(registration:, session:, removed: [])
    @registration = registration
    @session = session
    @user = registration.user
    @festival = registration.festival
    @removed = @festival.sessions.includes(:activity).find(removed)

    @cart = Registrations::CalculateCartTotals.call(
      registration: @registration,
      current_user: @registration.user,
    )

    attachments['workshops.ics'] =
      WorkshopCalendar.new(registration, sessions: [session], deleted_sessions: @removed).to_ical

    mail(
      to: email_address_with_name(@user.email, @user.profile.name),
      cc: 'registrations@improvfest.nz',
      subject: "NZIF #{registration.festival.year}: added to #{session.activity.name}",
    )
  end

  def removed(registration:, session:)
    @registration = registration
    @session = session
    @user = registration.user
    @festival = registration.festival

    @cart = Registrations::CalculateCartTotals.call(
      registration: @registration,
      current_user: @registration.user,
    )

    attachments['workshops.ics'] =
      WorkshopCalendar.new(registration, deleted_sessions: [session]).to_ical

    mail(
      to: email_address_with_name(@user.email, @user.profile.name),
      cc: 'registrations@improvfest.nz',
      subject: "NZIF #{registration.festival.year}: removed from #{session.activity.name}",
    )
  end

  def feedback_reminder(registration:, session:)
    @registration = registration
    @session = session
    @workshop = session.activity
    @user = registration.user
    @festival = registration.festival

    mail(
      to: email_address_with_name(@user.email, @user.profile.name),
      subject: "Workshop feedback: #{session.activity.name}",
    )
  end
end
