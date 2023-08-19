class ParticipantMailer < ApplicationMailer
  def registration_confirmation(registration)
    @user = registration.user
    @festival = registration.festival

    mail(
      to: email_address_with_name(@user.email, @user.profile.name),
      subject: "Your NZIF #{registration.festival.year} registration",
    )
  end

  def workshop_confirmation(registration) # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
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

    attachments['workshops.ics'] = WorkshopCalendar.new(registration).to_ical

    mail(
      to: email_address_with_name(@user.email, @user.profile.name),
      subject: "Your NZIF #{registration.festival.year} workshop schedule",
    )
  end
end
