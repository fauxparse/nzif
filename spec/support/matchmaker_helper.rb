# frozen_string_literal: true

# Builds in-memory {Matchmaker} fixtures from plain JSON, so the algorithm can
# be exercised without touching the database. The shapes mirror what
# `Matchmaker::Loader` produces for a real festival.
module MatchmakerHelper
  # Reads as `expect(registration).to prefer(session)` rather than the
  # auto-generated `be_prefers(session)`.
  class PreferMatcher
    def initialize(expected)
      @expected = expected
    end

    def matches?(actual)
      @actual = actual
      actual.prefers?(@expected)
    end

    def failure_message
      "expected #{@actual.inspect} to prefer #{@expected.inspect}"
    end

    def failure_message_when_negated
      "expected #{@actual.inspect} not to prefer #{@expected.inspect}"
    end
  end

  def prefer(expected)
    PreferMatcher.new(expected)
  end

  SLOT_AM = '2026-10-02:am'
  SLOT_PM = '2026-10-02:pm'
  STARTS_AT_AM = '2026-10-02T10:00:00+13:00'
  STARTS_AT_PM = '2026-10-02T14:00:00+13:00'

  def build_allocation(sessions: [], registrations: [])
    Matchmaker::Allocation.new(sessions: sessions, registrations: registrations)
  end

  def session_json(
    id:,
    capacity: 5,
    slots: [SLOT_AM],
    placements: [],
    waitlist: [],
    activity_id: nil,
    name: nil,
    starts_at: STARTS_AT_AM
  )
    {
      id: id,
      starts_at: starts_at,
      activity_id: activity_id || id,
      name: name || id,
      capacity: capacity,
      placements: placements,
      waitlist: waitlist,
      slots: slots,
    }
  end

  def registration_json(id:, preferences:, name: nil)
    { id: id, name: name || id, preferences: preferences }
  end
end

