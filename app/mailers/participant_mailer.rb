class ParticipantMailer < ApplicationMailer
  def registration_confirmation(registration:)
    @user = registration.user
    @festival = registration.festival

    mail(
      to: email_address_with_name(@user.email, @user.profile.name),
      subject: "Your NZIF #{registration.festival.year} registration",
    )
  end

  def workshop_confirmation(registration:) # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
    @registration = Registration
      .includes(
        placements: { session: %i[activity venue slot] },
        preferences: [:slot, { session: %i[activity venue] }],
      )
      .find(registration.id)
    @user = registration.user
    @festival = registration.festival
    @placements = registration.placements
      .includes(session: %i[activity venue])
      .sort_by { |p| p.session.starts_at }
    slots = Set.new(@placements.map { |p| p.session.slot })
    @empty_slots = registration
      .preferences
      .reject { |p| slots.include?(p.slot) }
      .sort_by { |p| p.slot.starts_at }
      .group_by(&:slot)

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

  def added(registration:, session:, removed: []) # rubocop:disable Metrics/AbcSize
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
end
